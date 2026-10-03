const Notification = require("../models/Notification");

async function listNotifications(req, res) {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return res.json({ success: true, data: notifications.map((item) => ({
      id: item._id,
      type: item.type,
      title: item.title,
      message: item.message,
      relatedId: item.relatedId || null,
      relatedType: item.relatedType || null,
      read: Boolean(item.isRead),
      createdAt: item.createdAt,
    })) });
  } catch (error) {
    console.error("Notification list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load notifications." });
  }
}

async function markNotificationsRead(req, res) {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } });
    return res.json({ success: true });
  } catch (error) {
    console.error("Notification read error:", error);
    return res.status(500).json({ success: false, message: "Unable to update notifications." });
  }
}

module.exports = { listNotifications, markNotificationsRead };
