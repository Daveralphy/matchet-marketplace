const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Order = require("../models/Order");
const Message = require("../models/Message");
const User = require("../models/User");

function initials(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).map((value) => value[0]).join("").slice(0, 2).toUpperCase();
}

function serializeUser(user) {
  return {
    id: user?._id || null,
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    initials: initials(user),
    avatar: user?.avatar?.url || null,
  };
}

function canonicalConversationId(firstId, secondId) {
  return [String(firstId), String(secondId)].sort().join(":");
}

function getConversationCustomerId(conversationId, providerId) {
  if (typeof conversationId !== "string" || conversationId.length > 100) return null;
  const providerIdString = String(providerId);
  const participants = conversationId.split(":");
  if (
    participants.length !== 2
    || !participants.every((id) => mongoose.Types.ObjectId.isValid(id))
    || !participants.includes(providerIdString)
  ) return null;

  const customerId = participants.find((id) => id !== providerIdString);
  if (!customerId || conversationId !== canonicalConversationId(providerIdString, customerId)) return null;
  return customerId;
}

async function getProviderMessages(req, res) {
  try {
    const providerId = req.user._id;
    const messages = await Message.find({ $or: [{ senderId: providerId }, { receiverId: providerId }] })
      .sort({ createdAt: -1 }).limit(500)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar").lean();

    const conversations = new Map();
    for (const message of messages) {
      const isMine = String(message.senderId?._id) === String(providerId);
      const customer = isMine ? message.receiverId : message.senderId;
      if (!customer) continue;
      const expectedId = canonicalConversationId(providerId, customer._id);
      if (!conversations.has(expectedId)) {
        conversations.set(expectedId, {
          conversationId: expectedId,
          customer: serializeUser(customer),
          lastMessage: message.content || (message.attachments?.length ? "Attachment" : ""),
          lastMessageAt: message.createdAt,
          unreadCount: 0,
        });
      }
      if (!isMine && !message.readAt) conversations.get(expectedId).unreadCount += 1;
    }

    const data = [...conversations.values()].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    return res.json({ success: true, data: { conversations: data, unreadCount: data.reduce((sum, item) => sum + item.unreadCount, 0) } });
  } catch (error) {
    console.error("Provider messages error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your messages right now." });
  }
}

async function getProviderConversation(req, res) {
  try {
    const providerId = req.user._id;
    const { conversationId } = req.params;
    const customerId = getConversationCustomerId(conversationId, providerId);
    if (!customerId) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    // Query by the exact participant pair, not conversationId alone. This prevents
    // cross-user message leakage and still reads older messages with legacy thread IDs.
    const messages = await Message.find({
      $or: [
        { senderId: providerId, receiverId: customerId },
        { senderId: customerId, receiverId: providerId },
      ],
    }).sort({ createdAt: 1 }).limit(500)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar").lean();

    if (!messages.length) return res.status(404).json({ success: false, message: "Conversation not found." });

    await Message.updateMany(
      { receiverId: providerId, senderId: customerId, readAt: null },
      { $set: { readAt: new Date() } },
    );

    const customer = String(messages[0].senderId?._id) === String(providerId)
      ? messages[0].receiverId
      : messages[0].senderId;

    return res.json({
      success: true,
      data: {
        conversationId,
        customer: serializeUser(customer),
        messages: messages.map((message) => ({
          id: message._id,
          content: message.content || "",
          attachments: message.attachments || [],
          createdAt: message.createdAt,
          isMine: String(message.senderId?._id) === String(providerId),
          sender: serializeUser(message.senderId),
        })),
      },
    });
  } catch (error) {
    console.error("Provider conversation error:", error);
    return res.status(500).json({ success: false, message: "Unable to load this conversation right now." });
  }
}

async function sendProviderMessage(req, res) {
  try {
    const providerId = req.user._id;
    const { conversationId, receiverId, content, attachments } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(receiverId) || String(receiverId) === String(providerId)) {
      return res.status(400).json({ success: false, message: "Choose a valid recipient." });
    }
    const cleanContent = typeof content === "string" ? content.trim() : "";
    const cleanAttachments = Array.isArray(attachments) ? attachments.slice(0, 5) : [];
    if ((!cleanContent && !cleanAttachments.length) || cleanContent.length > 5000) {
      return res.status(400).json({ success: false, message: "Enter a message or attach a file. Messages must be 5,000 characters or fewer." });
    }

    const expectedConversationId = canonicalConversationId(providerId, receiverId);
    if (conversationId && conversationId !== expectedConversationId) {
      return res.status(400).json({ success: false, message: "The conversation does not match this recipient." });
    }

    const recipient = await User.findById(receiverId).select("_id").lean();
    if (!recipient) return res.status(404).json({ success: false, message: "Recipient not found." });

    const [existingConversation, relatedBooking, relatedOrder] = await Promise.all([
      Message.exists({
        $or: [
          { senderId: providerId, receiverId },
          { senderId: receiverId, receiverId: providerId },
        ],
      }),
      Booking.exists({ providerId, buyerId: receiverId }),
      Order.exists({ buyerId: receiverId, "items.sellerId": providerId }),
    ]);
    // Replies are allowed for an existing thread. New threads require a real buyer/seller
    // order relationship or customer/provider booking relationship.
    if (!existingConversation && !relatedBooking && !relatedOrder) {
      return res.status(403).json({ success: false, message: "You can message customers who have an order or booking with you, or reply to an existing conversation." });
    }

    const message = await Message.create({
      conversationId: expectedConversationId,
      senderId: providerId,
      receiverId,
      content: cleanContent,
      attachments: cleanAttachments,
    });
    const populated = await Message.findById(message._id).populate("senderId", "firstName lastName avatar").lean();

    return res.status(201).json({
      success: true,
      data: {
        id: populated._id,
        content: populated.content || "",
        attachments: populated.attachments || [],
        createdAt: populated.createdAt,
        isMine: true,
        sender: serializeUser(populated.senderId),
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: "The message content or recipient is invalid." });
    }
    console.error("Send provider message error:", error);
    return res.status(500).json({ success: false, message: "Unable to send your message right now." });
  }
}

module.exports = { getProviderMessages, getProviderConversation, sendProviderMessage, canonicalConversationId, getConversationCustomerId };
