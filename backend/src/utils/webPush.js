const PushSubscription = require("../models/PushSubscription");
async function sendPushToUser(userId, payload) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  const webpush = require("web-push");
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:support@matchet.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const subscriptions = await PushSubscription.find({ userId }).lean();
  await Promise.all(subscriptions.map(async (record) => {
    try { await webpush.sendNotification(record.subscription, JSON.stringify(payload)); }
    catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) await PushSubscription.deleteOne({ _id: record._id });
      else throw error;
    }
  }));
}
module.exports = { sendPushToUser };
