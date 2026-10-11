import { useEffect, useState } from "react";
import { detectIpLocation } from "../api/location";

export function getMarketplaceLocation() {
  try { return localStorage.getItem("matchet_location") || ""; } catch { return ""; }
}

export function saveMarketplaceLocation(location, source = "manual") {
  const label = typeof location === "string" ? location : location?.label || "";
  try {
    if (label) localStorage.setItem("matchet_location", label);
    else localStorage.removeItem("matchet_location");
    localStorage.setItem("matchet_location_source", source);
  } catch {}
  window.dispatchEvent(new CustomEvent("matchet-location-change", { detail: label }));
}

export function useMarketplaceLocation() {
  const [location, setLocation] = useState(getMarketplaceLocation);

  useEffect(() => {
    const sync = () => setLocation(getMarketplaceLocation());
    window.addEventListener("storage", sync);
    window.addEventListener("matchet-location-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("matchet-location-change", sync);
    };
  }, []);

  return location;
}

export async function initializeMarketplaceLocation() {
  let saved = "";
  let source = "";
  try {
    saved = localStorage.getItem("matchet_location") || "";
    source = localStorage.getItem("matchet_location_source") || "";
  } catch {}

  // A previously selected location wins. Migrate the old universal Lagos
  // default because older versions could not distinguish it from a user choice.
  const legacyLagosDefault = saved === "Lagos, Nigeria" && !source;
  if (saved && source !== "ip" && !legacyLagosDefault) return saved;
  try {
    if (legacyLagosDefault) {
      localStorage.removeItem("matchet_location");
      window.dispatchEvent(new CustomEvent("matchet-location-change", { detail: "" }));
    }
  } catch {}

  try {
    const detected = await detectIpLocation();
    if (!detected?.label) return source === "ip" ? saved : "";
    const current = getMarketplaceLocation();
    let currentSource = "";
    try { currentSource = localStorage.getItem("matchet_location_source") || ""; } catch {}
    if (current && currentSource === "manual") return current;
    localStorage.setItem("matchet_location", detected.label);
    localStorage.setItem("matchet_location_source", "ip");
    window.dispatchEvent(new CustomEvent("matchet-location-change", { detail: detected.label }));
    return detected.label;
  } catch {
    return source === "ip" ? saved : "";
  }
}
