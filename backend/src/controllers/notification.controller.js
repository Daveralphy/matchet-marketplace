const crypto = require("crypto");
const Notification = require("../models/Notification");
const User = require("../models/User");
const PushSubscription = require("../models/PushSubscription");
const Product = require("../models/Product");
const Service = require("../models/Service");
const { createNotification } = require("../utils/notificationService");
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
async function sendRecommendationsCron(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: "Unauthorized scheduled task." });
  }
  try {
    const users = await User.find({
      isActive: true, emailVerified: true,
      "preferences.notifications.email.recommendation": { $ne: false },
      "location.country": { $exists: true, $ne: "" },
    }).select("_id firstName email location preferences").limit(5000).lean();
    const products = await Product.find({ status: "active", inventory: { $gt: 0 } })
      .select("_id name shortDescription category price currency images location").sort({ viewCount: -1, createdAt: -1 }).limit(500).lean();
    const services = await Service.find({ status: "active" })
      .select("_id title description category pricing images location").sort({ viewCount: -1, createdAt: -1 }).limit(500).lean();
    let sent = 0;
    for (const user of users) {
      const recent = await Notification.findOne({ userId: user._id, type: "RECOMMENDATIONS_DIGEST", createdAt: { $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) } }).select("_id details").lean();
      if (recent) continue;
      const loc = user.location || {};
      const score = (item) => {
        const itemLoc = item.location || {};
        let points = 0;
        if (loc.city && itemLoc.city && loc.city.toLowerCase() === itemLoc.city.toLowerCase()) points += 4;
        if (loc.state && itemLoc.state && loc.state.toLowerCase() === itemLoc.state.toLowerCase()) points += 2;
        if (loc.country && itemLoc.country && loc.country.toLowerCase() === itemLoc.country.toLowerCase()) points += 1;
        return points;
      };
      const pool = [
        ...products.map((item) => ({ id: String(item._id), kind: "product", title: item.name, description: [item.category, item.price != null ? `${item.currency || "NGN"} ${Number(item.price).toLocaleString("en-NG")}` : ""].filter(Boolean).join(" · "), image: item.images?.find((img) => img.isPrimary)?.url || item.images?.[0]?.url || "", url: `/products/${item._id}`, score: score(item) })),
        ...services.map((item) => ({ id: String(item._id), kind: "service", title: item.title, description: [item.category, item.pricing?.amount != null ? `${item.pricing.currency || "NGN"} ${Number(item.pricing.amount).toLocaleString("en-NG")}` : "Contact for pricing"].filter(Boolean).join(" · "), image: item.images?.find((img) => img.isPrimary)?.url || item.images?.[0]?.url || "", url: `/services/${item._id}`, score: score(item) })),
      ].sort((a, b) => b.score - a.score);
      const history = await Notification.find({ userId: user._id, type: "RECOMMENDATIONS_DIGEST", createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).select("details.recommendationIds").lean();
      const recentlyRecommended = new Set(history.flatMap((item) => item.details?.recommendationIds || []));
      const items = pool.filter((item) => !recentlyRecommended.has(item.id)).slice(0, 4);
      if (!items.length) continue;
      const locationLabel = [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
      const digestDate = new Date().toISOString().slice(0, 10);
      const result = await createNotification({
        userId: user._id, type: "RECOMMENDATIONS_DIGEST", category: "recommendation",
        title: `Marketplace picks near ${loc.city || loc.state || loc.country}`,
        message: `Hi ${user.firstName || "there"}, here are a few products and services worth exploring around ${locationLabel}. We rotate suggestions to avoid repeating the same listings too often.`,
        actionUrl: `/explore?location=${encodeURIComponent(locationLabel)}`,
        details: { location: locationLabel, recommendationCount: items.length, recommendationIds: items.map((item) => item.id), sentOn: digestDate },
        emailItems: items.map(({ title, description, image, url }) => ({ title, description, image, url })),
        dedupeKey: `recommendations:${String(user._id)}:${digestDate}`,
        channels: ["inApp", "email", "push"],
      });
      if (result) sent += 1;
    }
    return res.json({ success: true, processed: users.length, sent });
  } catch (error) {
    console.error("Scheduled recommendations failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to send recommendations right now." });
  }
}

async function unsubscribeEmail(req, res) {
  const userId = String(req.query.user || "");
  const category = String(req.query.category || "");
  const token = String(req.query.token || "");
  if (!/^[a-f\d]{24}$/i.test(userId) || !["message", "recommendation"].includes(category) || !process.env.NOTIFICATION_TOKEN_SECRET) return res.status(400).send("This unsubscribe link is invalid or expired.");
  // The signed token is tied to both notification id and category.
  const notificationId = String(req.query.notification || "");
  const actual = crypto.createHmac("sha256", process.env.NOTIFICATION_TOKEN_SECRET).update(`${notificationId}:${category}`).digest("hex");
  if (!notificationId || !/^[a-f\\d]{64}$/i.test(token) || !crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(token))) return res.status(400).send("This unsubscribe link is invalid or expired.");
  await User.updateOne({ _id: userId }, { $set: { [`preferences.notifications.email.${category}`]: false } });
  return res.status(200).send("You have been unsubscribed from this email category. You can close this page.");
}
module.exports = { listNotifications, markNotificationsRead, markNotificationRead, savePushSubscription, removePushSubscription, getNotificationPreferences, updateNotificationPreferences, getPushKey, unsubscribeEmail, sendRecommendationsCron };
