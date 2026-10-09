export async function getMarketplaceProviderById(id) {
  try {
    const payload = await request(`/api/marketplace/providers/${encodeURIComponent(id)}`);
    return payload?.provider ? { ...payload.provider, services: Array.isArray(payload.services) ? payload.services : [] } : null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const maxAttempts = method === "GET" ? 3 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
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

      if (response.ok) {
        return payload && typeof payload === "object" ? payload : {};
      }

      const retryable = [502, 503, 504].includes(response.status);
      if (retryable && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        continue;
      }

      const error = new Error(payload?.message || "Marketplace request failed.");
      error.status = response.status;
      error.code = payload?.code;
      throw error;
    } catch (error) {
      if (attempt < maxAttempts && !error.status) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 800));
        continue;
      }
      throw error;
    }
  }
}

export async function getMarketplaceProducts({ sellerType = "", location = "" } = {}) {
  const params = new URLSearchParams();
  if (sellerType && sellerType !== "Verified sellers") params.set("sellerType", sellerType);
  if (location) params.set("location", location);
  const query = params.toString();
  const payload = await request("/api/marketplace/products" + (query ? "?" + query : ""));
  return Array.isArray(payload.products) ? payload.products : [];
}

export async function getMarketplaceServices({ location = "" } = {}) {
  const query = location ? "?location=" + encodeURIComponent(location) : "";
  const payload = await request("/api/marketplace/services" + query);
  return Array.isArray(payload.services) ? payload.services : [];
}

export async function getMarketplaceProviders({ location = "" } = {}) {
  const query = location ? "?location=" + encodeURIComponent(location) : "";
  const payload = await request("/api/marketplace/providers" + query);
  return Array.isArray(payload.providers) ? payload.providers : [];
}

export async function getMarketplaceProductById(id) {
  try {
    const payload = await request(`/api/marketplace/products/${encodeURIComponent(id)}`);
    return payload?.product ?? null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function getMarketplaceServiceById(id) {
  try {
    const payload = await request(`/api/marketplace/services/${encodeURIComponent(id)}`);
    return payload?.service ?? null;
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

export async function getBuyerOrders(){const p=await request("/api/orders");return p.orders??[];}
export async function getBuyerOrder(id){const p=await request("/api/orders/"+encodeURIComponent(id));return p.order??null;}
export async function getBuyerBookings(){const p=await request("/api/bookings");return p.bookings??[];}
export async function getBuyerBooking(id){const p=await request("/api/bookings/"+encodeURIComponent(id));return p.booking??null;}
export async function getSavedItems(){const p=await request("/api/saved-items");return p.items??[];}
export async function saveItem(data){const p=await request("/api/saved-items",{method:"POST",body:JSON.stringify(data)});return p.item;}
export async function removeSavedItem(id){return request("/api/saved-items/"+encodeURIComponent(id),{method:"DELETE"});}
export async function clearSavedItems(type){return request("/api/saved-items"+(type?"?type="+encodeURIComponent(type):""),{method:"DELETE"});}

export async function createBuyerOrder(payload) { const p = await request("/api/orders", { method: "POST", body: JSON.stringify(payload) }); return p.order ?? null; }
