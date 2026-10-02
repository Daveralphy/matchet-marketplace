import { uploadFiles } from "./uploads";
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
  const { cache: cacheOption, ...fetchOptions } = options;
  const method = (fetchOptions.method || "GET").toUpperCase();
  const useCache = method === "GET" && cacheOption !== false;
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
    ...fetchOptions,
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
  return request("/api/provider/services", { cache: false });
}

export async function createProviderService(payload) {
  const next = { ...payload };
  if (Array.isArray(payload.images)) {
    const files = payload.images.filter((item) => item instanceof File);
    const existing = payload.images.filter((item) => item && !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/services") : [];
    next.images = [...existing, ...uploaded].slice(0, 6);
  }
  return request("/api/provider/services", {
    method: "POST",
    body: JSON.stringify(next),
  });
}

export async function updateProviderService(id, payload) {
  const next = { ...payload };
  if (Array.isArray(payload.images)) {
    const files = payload.images.filter((item) => item instanceof File);
    const existing = payload.images.filter((item) => item && !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/services") : [];
    next.images = [...existing, ...uploaded].slice(0, 6);
  }
  return request("/api/provider/services/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify(next),
  });
}

export function deleteProviderService(id) {
  return request("/api/provider/services/" + encodeURIComponent(id), { method: "DELETE" });
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

async function prepareProviderOnboardingPayload(formData) {
  const next = { ...formData };

  if (formData.providerProfileImage instanceof File) {
    next.providerProfileImage = await uploadFiles(formData.providerProfileImage, "matchet/profiles").then(([file]) => file);
  }

  if (Array.isArray(formData.providerPortfolioMedia)) {
    const files = formData.providerPortfolioMedia.filter((item) => item instanceof File);
    const existing = formData.providerPortfolioMedia.filter((item) => !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/portfolio") : [];
    next.providerPortfolioMedia = [...existing, ...uploaded];
  }

  if (Array.isArray(formData.providerServiceImages)) {
    const files = formData.providerServiceImages.filter((item) => item instanceof File);
    const existing = formData.providerServiceImages.filter((item) => !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/services") : [];
    next.providerServiceImages = [...existing, ...uploaded];
  }

  for (const [field, folder] of [
    ["providerIdImageFront", "matchet/verification"],
    ["providerIdImageBack", "matchet/verification"],
    ["providerSelfieImage", "matchet/verification"],
  ]) {
    if (formData[field] instanceof File) {
      next[field] = await uploadFiles(formData[field], folder).then(([file]) => file);
    }
  }

  return next;
}

export async function saveProviderOnboardingDraft(formData) {
  const next = await prepareProviderOnboardingPayload(formData);
  return request("/api/provider/onboarding", {
    method: "POST",
    body: JSON.stringify({ formData: serializeOnboardingValue(next), draft: true }),
  });
}

export async function submitProviderOnboarding(formData) {
  const next = await prepareProviderOnboardingPayload(formData);
  return request("/api/provider/onboarding", {
    method: "POST",
    body: JSON.stringify({ formData: serializeOnboardingValue(next) }),
  });
}

export function getProviderBookings() {
  return request("/api/provider/bookings");
}

export function getProviderOnboardingDraft() {
  return request("/api/provider/onboarding/draft", { cache: false });
}

export function getProviderCapabilities() {
  return request("/api/provider/capabilities", { cache: false });
}

async function prepareSellerOnboardingPayload(formData) {
  const next = { ...formData };

  if (formData.profileImage instanceof File) {
    next.profileImage = await uploadFiles(formData.profileImage, "matchet/profiles").then(([file]) => file);
  }
  if (formData.businessLogo instanceof File) {
    next.businessLogo = await uploadFiles(formData.businessLogo, "matchet/stores").then(([file]) => file);
  }
  if (Array.isArray(formData.productImages)) {
    const files = formData.productImages.filter((item) => item instanceof File);
    const existing = formData.productImages.filter(
      (item) => item && typeof item === "object" && item.url && item.publicId,
    );
    const uploaded = files.length ? await uploadFiles(files, "matchet/products") : [];
    next.productImages = [...existing, ...uploaded].slice(0, 5);
  }

  const verificationFiles = [
    ["idImageFront", "matchet/verification"],
    ["idImageBack", "matchet/verification"],
    ["selfieImage", "matchet/verification"],
  ];
  for (const [field, folder] of verificationFiles) {
    if (formData[field] instanceof File) {
      next[field] = await uploadFiles(formData[field], folder).then(([file]) => file);
    }
  }

  return next;
}

export function getSellerOnboardingDraft() {
  return request("/api/provider/seller-onboarding/draft");
}

export async function saveSellerOnboardingDraft(formData) {
  const next = await prepareSellerOnboardingPayload(formData);
  return request("/api/provider/seller-onboarding", {
    method: "POST",
    body: JSON.stringify({ formData: serializeOnboardingValue(next), draft: true }),
  });
}

export async function submitSellerOnboarding(formData) {
  const next = await prepareSellerOnboardingPayload(formData);
  return request("/api/provider/seller-onboarding", {
    method: "POST",
    body: JSON.stringify({ formData: serializeOnboardingValue(next) }),
  });
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
export async function createSellerProduct(payload) {
  const next = { ...payload };
  if (Array.isArray(payload.images)) {
    const files = payload.images.filter((item) => item instanceof File);
    const existing = payload.images.filter((item) => !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/products") : [];
    next.images = [...existing, ...uploaded];
  }
  return request("/api/provider/seller-products",{method:"POST",body:JSON.stringify(next)});
}
export async function updateSellerProduct(id,payload) {
  const next = { ...payload };
  if (Array.isArray(payload.images)) {
    const files = payload.images.filter((item) => item instanceof File);
    const existing = payload.images.filter((item) => !(item instanceof File));
    const uploaded = files.length ? await uploadFiles(files, "matchet/products") : [];
    next.images = [...existing, ...uploaded];
  }
  return request("/api/provider/seller-products/"+encodeURIComponent(id),{method:"PATCH",body:JSON.stringify(next)});
}
export function deleteSellerProduct(id){return request("/api/provider/seller-products/"+encodeURIComponent(id),{method:"DELETE"});}

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
