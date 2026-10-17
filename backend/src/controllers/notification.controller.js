const crypto = require("crypto");
const Notification = require("../models/Notification");
const User = require("../models/User");
const PushSubscription = require("../models/PushSubscription");
const { safeActionUrl, makeUnsubscribeToken } = require("../utils/notificationService");

async function listNotifications(req, res) {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30).lean();
    return res.json({ success: true, data: notifications.map((item) => ({ id: item._id, type: item.type, title: item.title, message: item.message, details: item.details || {}, actionUrl: item.actionUrl || "/account/settings", relatedId: item.relatedId || null, relatedType: item.relatedType || null, read: Boolean(item.isRead), createdAt: item.createdAt })) });
  } catch (error) { console.error("Notification list error:", error); return res.status(500).json({ success: false, message: "Unable to load notifications." }); }
}
async function markNotificationsRead(req, res) {
  try { await Notification.updateMany({ userId: req.user._id, isRead: false }, { $set: { isRead: true } }); return res.json({ success: true }); }
  catch (error) { return res.status(500).json({ success: false, message: "Unable to update notifications." }); }
}
async function markNotificationRead(req, res) {
  try {
    const updated = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { $set: { isRead: true } }, { new: true }).select("_id");
    if (!updated) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.json({ success: true });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to update this notification." }); }
}
async function savePushSubscription(req, res) {
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) return res.status(400).json({ success: false, message: "A valid browser push subscription is required." });
  try {
    await PushSubscription.findOneAndUpdate({ endpoint: subscription.endpoint }, { $set: { userId: req.user._id, subscription } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({ success: true });
  } catch (error) { console.error("Save push subscription failed:", error.message); return res.status(500).json({ success: false, message: "Unable to enable push notifications." }); }
}
async function removePushSubscription(req, res) {
  const endpoint = String(req.body?.endpoint || "");
  if (!endpoint) return res.status(400).json({ success: false, message: "Subscription endpoint is required." });
  await PushSubscription.deleteOne({ userId: req.user._id, endpoint });
  return res.json({ success: true });
}
async function getNotificationPreferences(req, res) {
  const user = await User.findById(req.user._id).select("preferences").lean();
  return res.json({ success: true, data: user?.preferences?.notifications || {} });
}
async function updateNotificationPreferences(req, res) {
  const input = req.body?.notifications;
  if (!input || typeof input !== "object") return res.status(400).json({ success: false, message: "Notification preferences are required." });
  const categories = ["order", "booking", "payment", "application", "message", "recommendation", "security"];
  const channels = ["email", "push"];
  const updates = {};
  for (const channel of channels) {
    if (!input[channel] || typeof input[channel] !== "object") continue;
    updates[`preferences.notifications.${channel}`] = {};
    for (const category of categories) if (typeof input[channel][category] === "boolean") updates[`preferences.notifications.${channel}.${category}`] = input[channel][category];
  }
  if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: "No valid notification preferences were supplied." });
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select("preferences").lean();
  return res.json({ success: true, data: user?.preferences?.notifications || {} });
}
async function getPushKey(_req, res) {
  if (!process.env.VAPID_PUBLIC_KEY) return res.status(503).json({ success: false, configured: false, message: "Browser push is not configured yet." });
  return res.json({ success: true, configured: true, publicKey: process.env.VAPID_PUBLIC_KEY });
}
async function unsubscribeEmail(req, res) {
  const userId = String(req.query.user || "");
  const category = String(req.query.category || "");
  const token = String(req.query.token || "");
  if (!/^[a-f\d]{24}$/i.test(userId) || !["message", "recommendation"].includes(category) || !process.env.NOTIFICATION_TOKEN_SECRET) return res.status(400).send("This unsubscribe link is invalid or expired.");
  const expected = makeUnsubscribeToken(req.query.notification || "", category);
  // Token is tied to a notification id; the ID is part of the signed URL.
  const notificationId = String(req.query.notification || "");
  const actual = crypto.createHmac("sha256", process.env.NOTIFICATION_TOKEN_SECRET).update(`${notificationId}:${category}`).digest("hex");
  if (!notificationId || !crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(token))) return res.status(400).send("This unsubscribe link is invalid or expired.");
  await User.updateOne({ _id: userId }, { $set: { [`preferences.notifications.email.${category}`]: false } });
  return res.status(200).send("You have been unsubscribed from this email category. You can close this page.");
}
module.exports = { listNotifications, markNotificationsRead, markNotificationRead, savePushSubscription, removePushSubscription, getNotificationPreferences, updateNotificationPreferences, getPushKey, unsubscribeEmail };
