const Message = require("../models/Message");

function initials(user) {
  return [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function serializeUser(user) {
  return {
    id: user?._id || null,
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    initials: initials(user),
    avatar: user?.avatar?.url || null,
  };
}

async function getProviderMessages(req, res) {
  try {
    const providerId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: providerId }, { receiverId: providerId }],
    })
      .sort({ createdAt: -1 })
      .limit(500)
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar")
      .lean();

    const conversations = new Map();

    for (const message of messages) {
      const isMine = message.senderId?._id?.toString() === providerId.toString();
      const customer = isMine ? message.receiverId : message.senderId;
      if (!customer) continue;

      if (!conversations.has(message.conversationId)) {
        conversations.set(message.conversationId, {
          conversationId: message.conversationId,
          customer: serializeUser(customer),
          lastMessage: message.content || "",
          lastMessageAt: message.createdAt,
          unreadCount: 0,
        });
      }

      if (!isMine && !message.readAt) {
        conversations.get(message.conversationId).unreadCount += 1;
      }
    }

    const data = [...conversations.values()].sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
    );

    return res.json({
      success: true,
      data: {
        conversations: data,
        unreadCount: data.reduce((sum, item) => sum + item.unreadCount, 0),
      },
    });
  } catch (error) {
    console.error("Provider messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your messages right now.",
    });
  }
}

async function getProviderConversation(req, res) {
  try {
    const providerId = req.user._id;
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
      $or: [{ senderId: providerId }, { receiverId: providerId }],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "firstName lastName avatar")
      .populate("receiverId", "firstName lastName avatar")
      .lean();

    if (!messages.length) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await Message.updateMany(
      { conversationId, receiverId: providerId, readAt: null },
      { $set: { readAt: new Date() } },
    );

    const first = messages[0];
    const customer =
      first.senderId?._id?.toString() === providerId.toString()
        ? first.receiverId
        : first.senderId;

    return res.json({
      success: true,
      data: {
        conversationId,
        customer: serializeUser(customer),
        messages: messages.map((message) => ({
          id: message._id,
          content: message.content || "",
          createdAt: message.createdAt,
          isMine: message.senderId?._id?.toString() === providerId.toString(),
          sender: serializeUser(message.senderId),
        })),
      },
    });
  } catch (error) {
    console.error("Provider conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load this conversation right now.",
    });
  }
}

async function sendProviderMessage(req, res) {
  try {
    const providerId = req.user._id;
    const { conversationId, receiverId, content } = req.body;

    if (!receiverId || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "A recipient and message are required.",
      });
    }

    const message = await Message.create({
      conversationId:
        conversationId ||
        [providerId.toString(), receiverId.toString()].sort().join(":"),
      senderId: providerId,
      receiverId,
      content: content.trim(),
    });

    const populated = await Message.findById(message._id)
      .populate("senderId", "firstName lastName avatar")
      .lean();

    return res.status(201).json({
      success: true,
      data: {
        id: populated._id,
        content: populated.content,
        createdAt: populated.createdAt,
        isMine: true,
        sender: serializeUser(populated.senderId),
      },
    });
  } catch (error) {
    console.error("Send provider message error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
    });
  }
}

module.exports = {
  getProviderMessages,
  getProviderConversation,
  sendProviderMessage,
};