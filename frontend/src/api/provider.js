const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || "Something went wrong.");
    error.status = response.status;
    error.errors = payload.errors || {};
    throw error;
  }

  return payload;
}

export function getProviderDashboard() {
  return request("/api/provider/dashboard");
}


export function getProviderConversations() {
  return request("/api/provider/messages");
}

export function getProviderConversation(conversationId) {
  return request("/api/provider/messages/" + encodeURIComponent(conversationId));
}

export function sendProviderMessage(payload) {
  return request("/api/provider/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export function getProviderServices() {
  return request("/api/provider/services");
}

export function getProviderEarnings() {
  return request("/api/provider/earnings");
}

export function getProviderReviews() {
  return request("/api/provider/reviews");
}

export function getProviderProfile() {
  return request("/api/provider/profile");
}

export function getProviderSettings() {
  return request("/api/provider/settings");
}

export function updateProviderSettingsPreferences(payload) {
  return request("/api/provider/settings/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
