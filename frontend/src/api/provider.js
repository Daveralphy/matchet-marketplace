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
