const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Order = require("../models/Order");
const Booking = require("../models/Booking");

const MAX_MESSAGE_LENGTH = 5000;
const MAX_ATTACHMENTS = 5;
const INBOX_SCAN_LIMIT = 5000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function canonicalConversationId(firstId, secondId) {
  return [String(firstId), String(secondId)].sort().join(":");
}

function getOtherParticipantId(conversationId, userId) {
  if (typeof conversationId !== "string" || conversationId.length > 100) return null;
  const participants = conversationId.split(":");
  const current = String(userId);
  if (
    participants.length !== 2 ||
    !participants.every((id) => mongoose.Types.ObjectId.isValid(id)) ||
    !participants.includes(current)
  ) return null;
  const other = participants.find((id) => id !== current);
  if (!other || other === current || conversationId !== canonicalConversationId(current, other)) return null;
  return other;
}

function serializeUser(user) {
  return {
    id: user?._id || null,
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Matchet user",
    initials: [user?.firstName, user?.lastName].filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    avatar: user?.avatar?.url || null,
  };
}

function serializeMessage(message, userId) {
  return {
    id: message._id,
    content: message.content || "",
    attachments: message.attachments || [],
    createdAt: message.createdAt,
    readAt: message.readAt || null,
    isMine: String(message.senderId?._id || message.senderId) === String(userId),
    sender: typeof message.senderId === "object" && message.senderId?._id
      ? serializeUser(message.senderId)
      : null,
  };
}

async function getUnreadCount(req, res) {
  try {
    const unreadCount = await Message.countDocuments({ receiverId: req.user._id, readAt: null });
    return res.json({ success: true, data: { unreadCount } });
  } catch (error) {
    console.error("Unread message count error:", error);
    return res.status(500).json({ success: false, message: "Unable to load unread message count right now." });
  }
}

async function getInbox(req, res) {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .sort({ createdAt: -1, _id: -1 })
      .limit(INBOX_SCAN_LIMIT)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar")
      .lean();

    const conversations = new Map();
    for (const message of messages) {
      const mine = String(message.senderId?._id) === String(userId);
      const other = mine ? message.receiverId : message.senderId;
      if (!other?._id) continue;
      const id = canonicalConversationId(userId, other._id);
      if (!conversations.has(id)) {
        conversations.set(id, {
          conversationId: id,
          participant: serializeUser(other),
          lastMessage: message.content || (message.attachments?.length ? "Attachment" : ""),
          lastMessageAt: message.createdAt,
          unreadCount: 0,
        });
      }
      if (!mine && !message.readAt) conversations.get(id).unreadCount += 1;
    }
    const items = [...conversations.values()].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    return res.json({
      success: true,
      data: { conversations: items, unreadCount: items.reduce((total, item) => total + item.unreadCount, 0) },
    });
  } catch (error) {
    console.error("Inbox load error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your messages right now." });
  }
}

async function startConversation(req, res) {
  try {
    const userId = req.user._id;
    const recipientId = req.params.recipientId;
    if (!mongoose.Types.ObjectId.isValid(recipientId) || String(recipientId) === String(userId)) {
      return res.status(400).json({ success: false, message: "Choose a valid recipient." });
    }

    const recipient = await User.findById(recipientId).select("_id firstName lastName avatar isActive").lean();
    if (!recipient || !recipient.isActive) {
      return res.status(404).json({ success: false, message: "Recipient not found." });
    }

    const conversationId = canonicalConversationId(userId, recipientId);
    const existingThread = await Message.exists({
      $or: [
        { senderId: userId, receiverId: recipientId },
        { senderId: recipientId, receiverId: userId },
      ],
    });
    if (!existingThread && !(await hasRelationship(userId, recipientId))) {
      return res.status(403).json({
        success: false,
        message: "You can start a conversation after an order or service booking connects your accounts.",
        code: "MESSAGE_RELATIONSHIP_REQUIRED",
      });
    }

    return res.json({
      success: true,
      data: {
        conversationId,
        participant: serializeUser(recipient),
        messages: [],
        pagination: { limit: DEFAULT_PAGE_SIZE, hasMore: false, nextBefore: null },
      },
    });
  } catch (error) {
    console.error("Start conversation error:", error);
    return res.status(500).json({ success: false, message: "Unable to start this conversation right now." });
  }
}

async function getConversation(req, res) {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const otherId = getOtherParticipantId(conversationId, userId);
    if (!otherId) return res.status(404).json({ success: false, message: "Conversation not found." });

    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const pageSize = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;
    const before = req.query.before ? new Date(req.query.before) : null;
    if (req.query.before && Number.isNaN(before.getTime())) {
      return res.status(400).json({ success: false, message: "The message history cursor is invalid." });
    }

    const pairFilter = {
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
      ...(before ? { createdAt: { $lt: before } } : {}),
    };
    const messages = await Message.find(pairFilter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(pageSize + 1)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar")
      .lean();

    if (!messages.length && !before) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    const hasMore = messages.length > pageSize;
    const page = messages.slice(0, pageSize).reverse();

    if (!before) {
      await Message.updateMany(
        { senderId: otherId, receiverId: userId, readAt: null },
        { $set: { readAt: new Date() } },
      );
    }

    const firstMessage = page[0];
    const participant = firstMessage
      ? (String(firstMessage.senderId?._id) === String(userId) ? firstMessage.receiverId : firstMessage.senderId)
      : null;
    return res.json({
      success: true,
      data: {
        conversationId,
        participant: serializeUser(participant),
        messages: page.map((message) => serializeMessage(message, userId)),
        pagination: {
          limit: pageSize,
          hasMore,
          nextBefore: hasMore && page.length ? page[0].createdAt : null,
        },
      },
    });
  } catch (error) {
    console.error("Conversation load error:", error);
    return res.status(500).json({ success: false, message: "Unable to load this conversation right now." });
  }
}

async function hasRelationship(senderId, receiverId) {
  const [orderRelationship, bookingRelationship] = await Promise.all([
    Order.exists({
      $or: [
        { buyerId: senderId, "items.sellerId": receiverId },
        { buyerId: receiverId, "items.sellerId": senderId },
      ],
    }),
    Booking.exists({
      $or: [
        { buyerId: senderId, providerId: receiverId },
        { buyerId: receiverId, providerId: senderId },
      ],
    }),
  ]);
  return Boolean(orderRelationship || bookingRelationship);
}

async function sendMessage(req, res) {
  try {
    const senderId = req.user._id;
    const { receiverId, conversationId, content, attachments } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(receiverId) || String(receiverId) === String(senderId)) {
      return res.status(400).json({ success: false, message: "Choose a valid recipient." });
    }

    const cleanContent = typeof content === "string" ? content.trim() : "";
    const cleanAttachments = Array.isArray(attachments) ? attachments.slice(0, MAX_ATTACHMENTS) : [];
    if ((!cleanContent && !cleanAttachments.length) || cleanContent.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ success: false, message: "Enter a message or attach a file. Messages must be 5,000 characters or fewer." });
    }
    if (cleanAttachments.some((item) => !item || typeof item.url !== "string" || typeof item.publicId !== "string" || typeof item.type !== "string")) {
      return res.status(400).json({ success: false, message: "One or more attachments are invalid." });
    }

    const expectedId = canonicalConversationId(senderId, receiverId);
    if (conversationId && conversationId !== expectedId) {
      return res.status(400).json({ success: false, message: "The conversation does not match this recipient." });
    }

    const recipient = await User.findById(receiverId).select("_id isActive").lean();
    if (!recipient || !recipient.isActive) return res.status(404).json({ success: false, message: "Recipient not found." });

    const existingThread = await Message.exists({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    if (!existingThread && !(await hasRelationship(senderId, receiverId))) {
      return res.status(403).json({
        success: false,
        message: "You can start a conversation after an order or service booking connects your accounts.",
        code: "MESSAGE_RELATIONSHIP_REQUIRED",
      });
    }

    const created = await Message.create({
      conversationId: expectedId,
      senderId,
      receiverId,
      content: cleanContent,
      attachments: cleanAttachments,
    });
    const message = await Message.findById(created._id)
      .populate("senderId", "firstName lastName avatar")
      .lean();

    return res.status(201).json({ success: true, data: serializeMessage(message, senderId) });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: "The message content or recipient is invalid." });
    }
    console.error("Send message error:", error);
    return res.status(500).json({ success: false, message: "Unable to send your message right now." });
  }
}

module.exports = { getInbox, startConversation, getConversation, sendMessage, getUnreadCount, canonicalConversationId, getOtherParticipantId };
