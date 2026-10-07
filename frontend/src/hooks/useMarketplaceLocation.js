import { useEffect, useState } from "react";

export function getMarketplaceLocation() {
  return localStorage.getItem("matchet_location") || "Lagos, Nigeria";
}

export function useMarketplaceLocation() {
  const [location, setLocation] = useState(getMarketplaceLocation);

  useEffect(() => {
    const sync = () => setLocation(getMarketplaceLocation());
    window.addEventListener("storage", sync);
    window.addEventListener("matchet:location-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("matchet:location-change", sync);
    };
  }, []);

  return location;
}
