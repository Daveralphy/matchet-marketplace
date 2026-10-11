const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Something went wrong.");
    error.status = response.status;
    error.code = payload.code || "";
    throw error;
  }
  return payload;
}

export function getInbox(options = {}) {
  const query = options.syncTransactions ? "?syncTransactions=true" : "";
  return request("/api/messages" + query);
}

export function startConversation(recipientId) {
  return request("/api/messages/start/" + encodeURIComponent(recipientId));
}

export function getConversation(conversationId, options = {}) {
  const params = new URLSearchParams();
  if (options.before) params.set("before", options.before);
  if (options.beforeId) params.set("beforeId", options.beforeId);
  if (options.limit) params.set("limit", String(options.limit));
  const query = params.toString();
  return request("/api/messages/" + encodeURIComponent(conversationId) + (query ? "?" + query : ""));
}

export function sendMessage(payload) {
  return request("/api/messages", { method: "POST", body: JSON.stringify(payload) });
}

export function getUnreadCount() {
  return request("/api/messages/unread-count");
}
