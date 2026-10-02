const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    error.errors = payload.errors || {};
    throw error;
  }
  return payload;
}

export function getAdminDashboard() {
  return request("/api/admin/dashboard");
}

export function getAdminProviderApplications() {
  return request("/api/admin/providers/applications");
}

export function reviewAdminProviderApplication(applicationId, decision, note = "") {
  return request(`/api/admin/providers/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify({ decision, note }),
  });
}

export function getAdminSellerApplications() {
  return request("/api/admin/sellers/applications");
}

export function reviewAdminSellerApplication(applicationId, decision, note = "") {
  return request(`/api/admin/sellers/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify({ decision, note }),
  });
}

export function getAdminUsers() {
  return request("/api/admin/users");
}

export function updateAdminUserStatus(userId, isActive) {
  return request(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export function getAdminListings() {
  return request("/api/admin/listings");
}

export function updateAdminListingStatus(type, listingId, status) {
  return request(`/api/admin/listings/${type}/${listingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
