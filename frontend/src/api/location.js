const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function locationRequest(path) {
  const response = await fetch(API_BASE_URL + path, { credentials: "include" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Unable to determine location.");
  return payload?.data || {};
}

async function detectIpLocationFromPublicIpService() {
  // Local development and some proxy configurations do not provide Vercel's
  // geolocation headers. This fallback estimates location from the visitor's
  // public IP; it does not request browser GPS permission.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json();
    if (payload?.error) return null;
    const city = String(payload.city || "").trim();
    const state = String(payload.region || "").trim();
    const country = String(payload.country_name || "").trim();
    const parts = [city, state, country].filter(Boolean).filter((part, index, all) =>
      index === 0 || part.toLowerCase() !== all[index - 1].toLowerCase()
    );
    if (!parts.length) return null;
    return {
      label: parts.join(", "),
      city,
      state,
      country,
      countryCode: String(payload.country_code || "").trim().toUpperCase(),
      coordinates: null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function detectIpLocation() {
  try {
    const data = await locationRequest("/api/location/detect");
    if (data.location?.label) return data.location;
  } catch {
    // Fall through to the IP estimate for local development and proxy gaps.
  }
  return detectIpLocationFromPublicIpService();
}

export function detectBrowserLocation() {
  if (!navigator.geolocation) {
    return Promise.reject(new Error("Your browser does not support device location."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            lat: String(coords.latitude),
            lon: String(coords.longitude),
          });
          const data = await locationRequest("/api/location/reverse?" + params.toString());
          if (!data.location) throw new Error("Could not determine a nearby city.");
          resolve(data.location);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        const message = error.code === 1
          ? "Location permission was not granted. You can still search for a location."
          : error.code === 3
            ? "Location lookup timed out. Please try again."
            : "Unable to access your current location. You can still search manually.";
        reject(new Error(message));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}
