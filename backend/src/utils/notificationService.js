const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notification");

const CLIENT_URL = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const EMAIL_TYPES = new Set(["transactional", "security", "application", "booking", "order", "payment", "message", "recommendation"]);

function safeActionUrl(value) {
  const raw = String(value || "/account/settings");
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || /[\r\n]/.test(raw)) return "/account/settings";
  return raw.slice(0, 500);
}
function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
async function sendEmail({ to, subject, title, message, actionUrl, category, notificationId, userId }) {
  const provider = String(process.env.EMAIL_PROVIDER || "smtp").toLowerCase();
  if (provider === "smtp") {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM) throw new Error("SMTP is not configured");
    const nodemailer = require("nodemailer");
    const port = Number(process.env.SMTP_PORT);
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const unsubscribe = category === "recommendation" || category === "message"
      ? `<p style="font-size:12px;color:#77809c">Prefer fewer emails? <a href="${escapeHtml(CLIENT_URL())}/email-preferences?token=${encodeURIComponent(makeUnsubscribeToken(notificationId, category))}">Unsubscribe from ${escapeHtml(category)} emails</a>.</p>`
      : "";
    const logo = process.env.EMAIL_LOGO_URL || "https://raw.githubusercontent.com/Daveralphy/matchet-marketplace/staging/frontend/src/assets/logo/matchet_logoname.png";
    const href = actionUrl ? CLIENT_URL() + safeActionUrl(actionUrl) : CLIENT_URL() + "/account/settings";
    const html = `<!doctype html><html><body style="margin:0;background:#f5f7f6;font-family:Arial,sans-serif;color:#10183f"><div style="max-width:600px;margin:24px auto;padding:20px;background:white;border:1px solid #e5eae7;border-radius:16px"><img src="${escapeHtml(logo)}" alt="Matchet" width="180" style="display:block;max-width:100%;height:auto;margin-bottom:28px"><h1 style="font-size:24px">${escapeHtml(title)}</h1><p style="font-size:15px;line-height:1.7;color:#4b5577;white-space:pre-line">${escapeHtml(message)}</p><p><a href="${escapeHtml(href)}" style="display:inline-block;background:#07863a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">View details</a></p>${unsubscribe}<p style="font-size:12px;color:#77809c">© ${new Date().getFullYear()} Matchet Marketplace</p></div></body></html>`;
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html, ...(unsubscribe ? { headers: { "List-Unsubscribe": `<${CLIENT_URL()}/api/notifications/email-unsubscribe?user=${encodeURIComponent(String(userId || ""))}&notification=${encodeURIComponent(String(notificationId || ""))}&category=${encodeURIComponent(category)}&token=${encodeURIComponent(makeUnsubscribeToken(notificationId, category))}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}) });
    return;
  }
  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error("Resend is not configured");
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, html: `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><p><a href="${escapeHtml(CLIENT_URL() + safeActionUrl(actionUrl))}">View details</a></p>${category === "recommendation" || category === "message" ? `<p><a href="${escapeHtml(CLIENT_URL() + "/api/notifications/email-unsubscribe?user=" + encodeURIComponent(String(userId || "")) + "&notification=" + encodeURIComponent(String(notificationId || "")) + "&category=" + encodeURIComponent(category) + "&token=" + encodeURIComponent(makeUnsubscribeToken(notificationId, category)))}">Unsubscribe</a></p>` : ""}` }) });
    if (!response.ok) throw new Error("Email provider rejected notification");
    return;
  }
  throw new Error("Unsupported EMAIL_PROVIDER");
}
function makeUnsubscribeToken(notificationId, category) {
  if (!process.env.NOTIFICATION_TOKEN_SECRET) return "";
  return crypto.createHmac("sha256", process.env.NOTIFICATION_TOKEN_SECRET).update(`${notificationId}:${category}`).digest("hex");
}
async function createNotification({ userId, type, title, message, details = {}, actionUrl = "/account/settings", relatedId = null, relatedType = null, dedupeKey, category = "transactional", channels = ["inApp", "email", "push"], emailSubject }) {
  if (!userId || !type || !title || !message) return null;
  const user = await User.findById(userId).select("firstName email emailVerified preferences isActive").lean();
  if (!user || user.isActive === false) return null;
  const prefs = user.preferences?.notifications || {};
  const emailEnabled = channels.includes("email") && (["transactional", "security"].includes(category) || prefs.email?.[category] !== false);
  const pushEnabled = channels.includes("push") && prefs.push?.[category] !== false;
  const normalizedUrl = safeActionUrl(actionUrl);
  let notification;
  try {
    notification = await Notification.create({
      userId, type, title: String(title).slice(0, 200), message: String(message).slice(0, 3000),
      details, actionUrl: normalizedUrl, relatedId: relatedId && mongoose.Types.ObjectId.isValid(String(relatedId)) ? relatedId : undefined,
      relatedType, dedupeKey, delivery: { email: emailEnabled ? "pending" : "skipped", push: pushEnabled ? "pending" : "skipped" },
    });
  } catch (error) {
    if (error?.code === 11000) return null;
    console.error("Notification record failed:", error.message);
    return null;
  }
  if (emailEnabled && user.email && (user.emailVerified || ["transactional", "security"].includes(category))) {
    try {
      await sendEmail({ to: user.email, subject: emailSubject || title, title, message, actionUrl: normalizedUrl, category, notificationId: notification._id, userId });
      await Notification.updateOne({ _id: notification._id }, { $set: { "delivery.email": "sent" } });
    } catch (error) {
      console.error("Notification email failed:", error.message);
      await Notification.updateOne({ _id: notification._id }, { $set: { "delivery.email": "failed" } });
    }
  }
  if (pushEnabled) {
    try {
      const push = require("./webPush");
      await push.sendPushToUser(String(userId), { title, body: message, url: CLIENT_URL() + normalizedUrl, notificationId: String(notification._id) });
      await Notification.updateOne({ _id: notification._id }, { $set: { "delivery.push": "sent" } });
    } catch (error) {
      await Notification.updateOne({ _id: notification._id }, { $set: { "delivery.push": "failed" } });
      if (error.code !== "MODULE_NOT_FOUND") console.error("Push notification failed:", error.message);
    }
  }
  return notification;
}
module.exports = { createNotification, safeActionUrl, makeUnsubscribeToken };
