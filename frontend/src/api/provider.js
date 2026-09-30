const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CACHE_PREFIX = "matchet_provider_cache:";
const CACHE_TTL = 5 * 60 * 1000;
const memoryCache = new Map();

function cacheUserKey() {
  return sessionStorage.getItem("matchet_cache_user") || "anonymous";
}
function cacheKey(path) {
  return CACHE_PREFIX + cacheUserKey() + ":" + path;
}
function readCache(path) {
  const key = cacheKey(path);
  const memory = memoryCache.get(key);
  if (memory && Date.now() - memory.time < CACHE_TTL) return memory.data;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || "null");
    if (saved && Date.now() - saved.time < CACHE_TTL) {
      memoryCache.set(key, saved);
      return saved.data;
    }
  } catch {}
  return null;
}
function writeCache(path, data) {
  const entry = { time: Date.now(), data };
  const key = cacheKey(path);
  memoryCache.set(key, entry);
  try { sessionStorage.setItem(key, JSON.stringify(entry)); } catch {}
}
export function clearProviderCache() {
  for (const key of memoryCache.keys()) memoryCache.delete(key);
  try {
    Object.keys(sessionStorage).filter((key) => key.startsWith(CACHE_PREFIX)).forEach((key) => sessionStorage.removeItem(key));
  } catch {}
}
async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const useCache = method === "GET" && options.cache !== false;
  if (useCache) {
    const cached = readCache(path);
    if (cached !== null) return cached;
  }

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

  if (useCache) writeCache(path, payload);
  else clearProviderCache();
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

export function getSellerReviews(){ return request("/api/provider/seller-reviews"); }

export function getSellerProfile(){return request("/api/provider/seller-profile");}
export function updateSellerProfile(payload){return request("/api/provider/seller-profile",{method:"PATCH",body:JSON.stringify(payload)});}

export function getSellerSettings(){return request("/api/provider/seller-settings");}
export function updateSellerSettingsPreferences(payload){return request("/api/provider/seller-settings/preferences",{method:"PATCH",body:JSON.stringify(payload)});}
export function updateSellerSettingsStore(payload){return request("/api/provider/seller-settings/store",{method:"PATCH",body:JSON.stringify(payload)});}

export function getPublicSellerStore(slug){return request("/api/provider/store/"+encodeURIComponent(slug));}

export function getSellerOrderDetail(id){return request("/api/provider/seller-orders/"+encodeURIComponent(id));}
export function updateSellerOrderNote(id,note){return request("/api/provider/seller-orders/"+encodeURIComponent(id)+"/note",{method:"PATCH",body:JSON.stringify({note})});}
