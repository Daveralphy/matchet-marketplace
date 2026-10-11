const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function locationRequest(path) {
  const response = await fetch(API_BASE_URL + path, { credentials: "include" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Unable to determine location.");
  return payload?.data || {};
}

export async function detectIpLocation() {
  const data = await locationRequest("/api/location/detect");
  return data.location || null;
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
