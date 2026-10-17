const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const { createNotification } = require("../utils/createNotification");

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
    orderCard: message.orderCard ? {
      orderId: String(message.orderCard.orderId || ""),
      items: (message.orderCard.items || []).map((item) => ({
        name: item.name || "Product",
        image: item.image || "",
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || 0),
      })),
      total: Number(message.orderCard.total || 0),
      currency: message.orderCard.currency || "NGN",
      status: message.orderCard.status || "pending",
      placedAt: message.orderCard.placedAt || message.createdAt,
    } : null,
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

async function ensureTransactionOpeningMessages(userId) {
  // The first order or booking between two accounts becomes the opening message.
  // Existing conversations are left untouched.
  const [orders, bookings] = await Promise.all([
    Order.find({ $or: [{ buyerId: userId }, { "items.sellerId": userId }], orderStatus: { $ne: "cancelled" }, paymentStatus: { $nin: ["failed", "refunded"] } })
      .sort({ createdAt: 1, _id: 1 })
      .limit(500)
      .select("_id buyerId items sellerId nameSnapshot quantity priceSnapshot total currency orderStatus createdAt")
      .lean(),
    Booking.find({ $or: [{ buyerId: userId }, { providerId: userId }], status: { $nin: ["cancelled", "declined"] } })
      .sort({ createdAt: 1, _id: 1 })
      .limit(500)
      .select("_id buyerId providerId serviceId scheduledDate scheduledTime priceSnapshot status createdAt")
      .populate("serviceId", "title")
      .lean(),
  ]);

  for (const order of orders) {
    const buyerId = String(order.buyerId);
    const sellers = new Map();
    for (const item of order.items || []) {
      const sellerId = String(item.sellerId || "");
      if (sellerId && sellerId !== buyerId) sellers.set(sellerId, true);
    }
    for (const sellerId of sellers.keys()) {
      if (String(userId) !== buyerId && String(userId) !== sellerId) continue;
      const sourceRef = "order:" + String(order._id) + ":seller:" + sellerId;
      const existingSeed = await Message.findOne({ sourceRef }).select("_id orderCard").lean();
      const existingThread = existingSeed ? true : await Message.exists({
        $or: [
          { senderId: buyerId, receiverId: sellerId },
          { senderId: sellerId, receiverId: buyerId },
        ],
      });
      const sellerItems = (order.items || []).filter((item) => String(item.sellerId) === sellerId);
      const amount = sellerItems.reduce((sum, item) => sum + Number(item.priceSnapshot || 0) * Number(item.quantity || 1), 0);
      const currency = String(order.currency || "NGN").toUpperCase();
      const content = `Placed order #${String(order._id).slice(-8).toUpperCase()}`;
      const orderCard = {
        orderId: order._id,
        items: sellerItems.map((item) => ({
          name: item.nameSnapshot || "Product",
          image: item.imageSnapshot || "",
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.priceSnapshot || 0),
        })),
        total: amount,
        currency,
        status: order.orderStatus || "pending",
        placedAt: order.createdAt,
      };
      if (existingSeed) {
        // Upgrade automatic opening messages created by the earlier text-only implementation.
        await Message.updateOne({ _id: existingSeed._id }, { $set: { category: "product", ...(!existingSeed.orderCard ? { content, orderCard } : {}) } });
        continue;
      }
      // Each order gets its own order-card message inside the canonical buyer/seller thread.
      // Existing conversations are reused because the conversation ID is derived from the participant pair.
      try {
        await Message.create({
          conversationId: canonicalConversationId(buyerId, sellerId),
          sourceRef,
          category: "product",
          senderId: buyerId,
          receiverId: sellerId,
          content,
          orderCard,
        });
      } catch (error) {
        // Concurrent inbox loads may race to create the same opening message.
        if (!(error?.code === 11000)) throw error;
      }
    }
  }

  for (const booking of bookings) {
    const buyerId = String(booking.buyerId);
    const providerId = String(booking.providerId);
    if (!buyerId || !providerId || buyerId === providerId) continue;
    const sourceRef = "booking:" + String(booking._id) + ":provider:" + providerId;
    const existingSeed = await Message.findOne({ sourceRef }).select("_id category").lean();
    if (existingSeed) {
      if (existingSeed.category !== "service") {
        await Message.updateOne({ _id: existingSeed._id }, { $set: { category: "service" } });
      }
      continue;
    }
    const serviceName = booking.serviceId?.title || "Service booking";
    const date = booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString("en-NG") : "Not specified";
    const currency = String(booking.priceSnapshot?.currency || "NGN").toUpperCase();
    const amount = Number(booking.priceSnapshot?.amount || 0).toLocaleString("en-NG");
    const content = [
      "New service booking",
      `Service: ${serviceName}`,
      `Scheduled date: ${date} at ${booking.scheduledTime || "a time to be confirmed"}`,
      `Booking amount: ${currency} ${amount}`,
      `Booking status: ${booking.status || "pending"}`,
      "This conversation was started automatically from the booking. You can use this chat to coordinate the service.",
    ].join("\n");
    try {
      await Message.create({
        conversationId: canonicalConversationId(buyerId, providerId),
        sourceRef,
        category: "service",
        senderId: buyerId,
        receiverId: providerId,
        content,
      });
    } catch (error) {
      if (!(error?.code === 11000)) throw error;
    }
  }
}

async function getInbox(req, res) {
  try {
    const userId = req.user._id;
    if (req.query.syncTransactions === "true") await ensureTransactionOpeningMessages(userId);
    const requestedCategory = ["product", "service"].includes(req.query.category) ? req.query.category : "";
    const inboxFilter = {
      $and: [
        { $or: [{ senderId: userId }, { receiverId: userId }] },
        ...(requestedCategory ? [{ category: requestedCategory }] : []),
      ],
      hiddenFor: { $ne: userId },
      archivedFor: req.query.archived === "true" ? userId : { $ne: userId },
    };
    const messages = await Message.find(inboxFilter)
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

async function updateConversationState(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const otherId = getOtherParticipantId(conversationId, userId);
    if (!otherId) return res.status(404).json({ success: false, message: "Conversation not found." });
    const { action } = req.body || {};
    const pair = {
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
      ...(["product", "service"].includes(req.body?.category) ? { category: req.body.category } : {}),
    };
    let update;
    if (action === "read") {
      update = { $set: { readAt: new Date() } };
      await Message.updateMany({ ...pair, receiverId: userId, readAt: null }, update);
    } else if (action === "unread") {
      // Mark the latest message from the other participant unread for this user.
      const latestIncoming = await Message.findOne({ ...pair, receiverId: userId }).sort({ createdAt: -1, _id: -1 }).select("_id").lean();
      if (latestIncoming) {
        await Message.updateOne({ _id: latestIncoming._id, receiverId: userId }, { $unset: { readAt: 1 } });
      }
    } else if (action === "archive") {
      await Message.updateMany(pair, { $addToSet: { archivedFor: userId } });
    } else if (action === "unarchive") {
      await Message.updateMany(pair, { $pull: { archivedFor: userId } });
    } else if (action === "delete") {
      await Message.updateMany(pair, { $addToSet: { hiddenFor: userId } });
    } else {
      return res.status(400).json({ success: false, message: "Choose a valid conversation action." });
    }
    return res.json({ success: true, data: { conversationId, action } });
  } catch (error) {
    console.error("Update conversation state error:", error);
    return res.status(500).json({ success: false, message: "Unable to update this conversation right now." });
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
    const beforeId = req.query.beforeId ? String(req.query.beforeId) : "";
    if (
      (req.query.before && Number.isNaN(before.getTime())) ||
      (beforeId && !mongoose.Types.ObjectId.isValid(beforeId))
    ) {
      return res.status(400).json({ success: false, message: "The message history cursor is invalid." });
    }

    const pairFilter = {
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
      ...(before ? {
        $and: [{
          $or: [
            { createdAt: { $lt: before } },
            ...(beforeId ? [{ createdAt: before, _id: { $lt: new mongoose.Types.ObjectId(beforeId) } }] : []),
          ],
        }],
      } : {}),
    };
    if (["product", "service"].includes(req.query.category)) {
      pairFilter.$and = [
        ...(Array.isArray(pairFilter.$and) ? pairFilter.$and : pairFilter.$and ? [pairFilter.$and] : []),
        { category: req.query.category },
      ];
    }

    const messages = await Message.find(pairFilter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(pageSize + 1)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar")
      .lean();

    if (!messages.length && !before) {
      const [participant, related] = await Promise.all([
        User.findById(otherId).select("_id firstName lastName avatar isActive").lean(),
        hasRelationship(userId, otherId),
      ]);
      if (!participant || !participant.isActive || !related) {
        return res.status(404).json({ success: false, message: "Conversation not found." });
      }
      return res.json({
        success: true,
        data: {
          conversationId,
          participant: serializeUser(participant),
          messages: [],
          pagination: { limit: pageSize, hasMore: false, nextBefore: null, nextBeforeId: null },
        },
      });
    }

    const hasMore = messages.length > pageSize;
    const page = messages.slice(0, pageSize).reverse();

    if (!before) {
      await Message.updateMany(
        {
          senderId: otherId,
          receiverId: userId,
          readAt: null,
          ...(["product", "service"].includes(req.query.category) ? { category: req.query.category } : {}),
        },
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
          nextBeforeId: hasMore && page.length ? page[0]._id : null,
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
    const category = ["product", "service"].includes(req.body?.category) ? req.body.category : "general";
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

    const [existingThread, productRelationship, serviceRelationship] = await Promise.all([
      Message.exists({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }),
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
    if (!existingThread && !productRelationship && !serviceRelationship) {
      return res.status(403).json({
        success: false,
        message: "You can start a conversation after an order or service booking connects your accounts.",
        code: "MESSAGE_RELATIONSHIP_REQUIRED",
      });
    }
    if (category === "product" && !productRelationship) {
      return res.status(403).json({ success: false, message: "Product messages require a product order between these accounts." });
    }
    if (category === "service" && !serviceRelationship) {
      return res.status(403).json({ success: false, message: "Service messages require a service booking between these accounts." });
    }

    const created = await Message.create({
      conversationId: expectedId,
      category,
      senderId,
      receiverId,
      content: cleanContent,
      attachments: cleanAttachments,
    });
    const message = await Message.findById(created._id)
      .populate("senderId", "firstName lastName avatar")
      .lean();

    const senderName = [req.user.firstName, req.user.lastName].filter(Boolean).join(" ") || "Someone";
    await createNotification({
      userId: receiverId,
      type: "NEW_MESSAGE",
      title: "You have a new message",
      message: `${senderName} sent you a message. Open your inbox to respond.`,
      relatedId: created._id,
      relatedType: "message",
      actionUrl: "/messages", category: "message",
      details: { sender: senderName, messageCategory: category, sentAt: created.createdAt },
    });

    return res.status(201).json({ success: true, data: serializeMessage(message, senderId) });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: "The message content or recipient is invalid." });
    }
    console.error("Send message error:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      senderId: String(req.user?._id || ""),
      receiverId: typeof receiverId === "string" ? receiverId : String(receiverId || ""),
    });
    const payload = { success: false, message: "Unable to send your message right now." };
    if (process.env.NODE_ENV !== "production") {
      payload.debug = {
        name: error?.name || "Error",
        message: error?.message || "Unknown error",
        code: error?.code || null,
      };
    }
    return res.status(500).json(payload);
  }
}

module.exports = { getInbox, startConversation, getConversation, sendMessage, getUnreadCount, updateConversationState, canonicalConversationId, getOtherParticipantId };
