const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Marketplace request failed.");
    error.status = response.status;
    error.code = payload?.code;
    throw error;
  }

  return payload;
}

export async function getMarketplaceProducts() {
  const payload = await request("/api/marketplace/products");
  return payload.products ?? [];
}

export async function getMarketplaceServices() {
  const payload = await request("/api/marketplace/services");
  return payload.services ?? [];
}

export async function getMarketplaceProviders() {
  const payload = await request("/api/marketplace/providers");
  return payload.providers ?? [];
}

export async function getMarketplaceProductById(id) {
  try {
    const payload = await request(`/api/marketplace/products/${encodeURIComponent(id)}`);
    return payload.product ?? null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function getMarketplaceServiceById(id) {
  try {
    const payload = await request(`/api/marketplace/services/${encodeURIComponent(id)}`);
    return payload.service ?? null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function getProviderProfile() {
  const payload = await request("/api/marketplace/provider/profile");
  return payload.profile ?? null;
}

export async function saveProviderProfile(profile) {
  const payload = await request("/api/marketplace/provider/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });
  return payload.profile;
}

export async function createProviderService(service) {
  const payload = await request("/api/marketplace/provider/services", {
    method: "POST",
    body: JSON.stringify(service),
  });
  return payload.service;
}

export async function getSellerProfile() {
  const payload = await request("/api/marketplace/seller/profile");
  return payload.profile ?? null;
}

export async function saveSellerProfile(profile) {
  const payload = await request("/api/marketplace/seller/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });
  return payload.profile;
}

export async function createSellerProduct(product) {
  const payload = await request("/api/marketplace/seller/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
  return payload.product;
}


export async function getCart() {
  const payload = await request("/api/cart");
  return payload.items ?? [];
}

export async function addCartItem(productId, quantity = 1) {
  const payload = await request("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
  return payload.items ?? [];
}

export async function updateCartItem(productId, quantity) {
  const payload = await request(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return payload.items ?? [];
}

export async function removeCartItem(productId) {
  const payload = await request(`/api/cart/items/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
  return payload.items ?? [];
}

export async function clearCart() {
  const payload = await request("/api/cart", { method: "DELETE" });
  return payload.items ?? [];
}
