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

export function getInbox() {
  return request("/api/messages");
}

export function getConversation(conversationId) {
  return request("/api/messages/" + encodeURIComponent(conversationId));
}

export function sendMessage(payload) {
  return request("/api/messages", { method: "POST", body: JSON.stringify(payload) });
}
