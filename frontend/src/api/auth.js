const API_BASE_URL = window.location.hostname === "matchet-staging.vercel.app" ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000");

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

export function register(data) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return request("/api/auth/me");
}

export function logout() {
  return request("/api/auth/logout", { method: "POST" });
}


export function updateCurrentUser(data) {
  return request("/api/auth/me", { method: "PATCH", body: JSON.stringify(data) });
}
