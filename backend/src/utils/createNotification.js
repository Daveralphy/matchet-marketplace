const Notification = require("../models/Notification");

async function createNotification({ userId, type, title, message, relatedId = null, relatedType = null }) {
  if (!userId || !type || !title || !message) return null;
  try {
    return await Notification.create({
      userId,
      type,
      title: String(title).slice(0, 200),
      message: String(message).slice(0, 1000),
      relatedId: relatedId || undefined,
      relatedType: relatedType || undefined,
    });
  } catch (error) {
    // Notification delivery must never roll back an order, payment, or message.
    console.error("Create notification failed:", error.message);
    return null;
  }
}

module.exports = { createNotification };
