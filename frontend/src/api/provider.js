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

function serializeOnboardingValue(value) {
  if (typeof File !== "undefined" && value instanceof File) {
    return { name: value.name, type: value.type, size: value.size, lastModified: value.lastModified };
  }
  if (Array.isArray(value)) return value.map(serializeOnboardingValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeOnboardingValue(item)]));
  }
  return value;
}

export function submitProviderOnboarding(formData) {
  return request("/api/provider/onboarding", {
    method: "POST",
    body: JSON.stringify({ formData: serializeOnboardingValue(formData) }),
  });
}

export function getProviderBookings() {
  return request("/api/provider/bookings");
}

export function getProviderCapabilities() {
  return request("/api/provider/capabilities");
}

export function submitSellerOnboarding(formData) {
  return request("/api/provider/seller-onboarding", { method: "POST", body: JSON.stringify({ formData: serializeOnboardingValue(formData) }) });
}

export function getSellerDashboard() {
  return request("/api/provider/seller-dashboard");
}

export function getSellerOrders(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
  return request("/api/provider/seller-orders?" + query.toString());
}
export function updateSellerOrderStatus(orderId, status) {
  return request("/api/provider/seller-orders/" + encodeURIComponent(orderId) + "/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getSellerProducts(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined&&v!==null&&v!==""));
  return request("/api/provider/seller-products?" + query.toString());
}
export function createSellerProduct(payload) {
  return request("/api/provider/seller-products",{method:"POST",body:JSON.stringify(payload)});
}
export function updateSellerProduct(id,payload) {
  return request("/api/provider/seller-products/"+encodeURIComponent(id),{method:"PATCH",body:JSON.stringify(payload)});
}

export function getSellerEarnings(){ return request("/api/provider/seller-earnings"); }
