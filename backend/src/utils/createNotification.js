const { createNotification: deliverNotification } = require("./notificationService");

function categoryFor(type) {
  const value = String(type || "").toUpperCase();
  if (value.includes("SECURITY") || value.includes("LOGIN") || value.includes("PASSWORD")) return "security";
  if (value.includes("MESSAGE")) return "message";
  if (value.includes("RECOMMEND")) return "recommendation";
  if (value.includes("APPLICATION")) return "application";
  if (value.includes("BOOKING")) return "booking";
  if (value.includes("PAYMENT")) return "payment";
  if (value.startsWith("ORDER_")) return "order";
  return "transactional";
}
async function createNotification({ userId, type, title, message, relatedId = null, relatedType = null, details = {}, emailItems = [], actionUrl, dedupeKey, category, channels }) {
  if (!userId || !type || !title || !message) return null;
  try {
    return await deliverNotification({
      userId, type, title, message, details, emailItems, actionUrl: actionUrl || defaultAction(type, relatedId),
      relatedId, relatedType, dedupeKey, category: category || categoryFor(type),
      channels: channels || ["inApp", "email", "push"],
    });
  } catch (error) {
    // A notification must never roll back the business operation that triggered it.
    console.error("Create notification failed:", error.message);
    return null;
  }
}
function defaultAction(type, relatedId) {
  const value = String(type || "").toUpperCase();
  const id = relatedId ? encodeURIComponent(String(relatedId)) : "";
  if (value.includes("MESSAGE")) return "/messages";
  if (value.includes("ORDER") || value.includes("PAYMENT")) return id ? "/orders/" + id : "/orders";
  if (value.includes("BOOKING")) return "/bookings";
  if (value.includes("SELLER_APPLICATION")) return "/seller/dashboard";
  if (value.includes("PROVIDER_APPLICATION")) return "/provider/dashboard";
  return "/account/settings";
}
module.exports = { createNotification };
