const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const TRANSIENT_STATUSES = new Set([502, 503, 504]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}, { retryTransient = false } = {}) {
  const method = (options.method || "GET").toUpperCase();
  const shouldRetry = retryTransient || method === "GET";
  const maxAttempts = shouldRetry ? 3 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(API_BASE_URL + path, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) return payload;

      const error = new Error(payload.message || "Something went wrong.");
      error.status = response.status;
      error.errors = payload.errors || {};

      if (shouldRetry && TRANSIENT_STATUSES.has(response.status) && attempt < maxAttempts) {
        await sleep(800 * 2 ** (attempt - 1));
        continue;
      }

      throw error;
    } catch (error) {
      if (shouldRetry && !error.status && attempt < maxAttempts) {
        await sleep(800 * 2 ** (attempt - 1));
        continue;
      }
      throw error;
    }
  }

  throw new Error("Request failed.");
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
  }, { retryTransient: true });
}

export function getCurrentUser() {
  return request("/api/auth/me");
}

export async function logout() {
  return request("/api/auth/logout", { method: "POST" });
}
export function updateCurrentUser(data) {
  return request("/api/auth/me", { method: "PATCH", body: JSON.stringify(data) });
}
