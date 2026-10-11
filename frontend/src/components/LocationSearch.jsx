import { useEffect, useRef, useState } from "react";
import { searchProviderLocations } from "../api/provider";
import { detectBrowserLocation } from "../api/location";

export default function LocationSearch({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search for a city, state, or country...",
  className = "",
  disabled = false,
  required = false,
  name,
  id,
  enableCurrentLocation = false,
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchError, setSearchError] = useState("");
  const rootRef = useRef(null);

  useEffect(() => setQuery(value || ""), [value]);

  const selectLocation = (location) => {
    if (!location) return;
    setQuery(location.label);
    setSuggestions([]);
    setIsOpen(false);
    setLocationError("");
    setSearchError("");
    onChange?.(location.label);
    onSelect?.(location);
  };

  const useCurrentLocation = async () => {
    if (detectingLocation || disabled) return;
    setDetectingLocation(true);
    setLocationError("");
    try {
      const location = await detectBrowserLocation();
      selectLocation(location);
    } catch (error) {
      setLocationError(error.message || "Unable to determine your current location.");
      setIsOpen(true);
    } finally {
      setDetectingLocation(false);
    }
  };

  useEffect(() => {
    const term = query.trim();
    if (!isOpen || term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setSearchError("");
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchError("");
      try {
        const response = await searchProviderLocations(term);
        if (active) setSuggestions(Array.isArray(response?.data?.locations) ? response.data.locations : []);
      } catch {
        if (active) {
          setSuggestions([]);
          setSearchError("Unable to load location suggestions. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, isOpen]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const showDropdown = isOpen && (
    enableCurrentLocation ||
    detectingLocation ||
    Boolean(locationError) ||
    Boolean(searchError) ||
    loading ||
    suggestions.length > 0 ||
    query.trim().length >= 2
  );

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <input
        type="text"
        name={name}
        id={id || name}
        value={query}
        disabled={disabled}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        aria-expanded={Boolean(showDropdown)}
        aria-autocomplete="list"
        className="box-border w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10183f] outline-none transition focus:border-[#07983f] focus:ring-2 focus:ring-[#07983f]/10"
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setIsOpen(true);
          setLocationError("");
          setSearchError("");
          onChange?.(next);
        }}
        onKeyDown={(event) => {
          if (event.key.length === 1 || event.key === "ArrowDown") setIsOpen(true);
          if (event.key === "Enter") {
            event.preventDefault();
            if (suggestions.length > 0) selectLocation(suggestions[0]);
          }
          if (event.key === "Escape") setIsOpen(false);
        }}
        onPointerDown={() => setIsOpen(true)}
      />

      {showDropdown && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(16,24,63,0.16)]"
        >
          {enableCurrentLocation && (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#07983f] hover:bg-[#f3faf5] disabled:cursor-wait disabled:opacity-60"
              onClick={useCurrentLocation}
              disabled={detectingLocation || disabled}
            >
              <span aria-hidden="true">⌖</span>
              {detectingLocation ? "Finding your location..." : "Use my current location"}
            </button>
          )}

          {locationError && (
            <div role="status" className="px-3 py-2 text-xs leading-5 text-rose-600">
              {locationError}
            </div>
          )}

          {loading && (
            <div className="px-3 py-2.5 text-sm text-slate-500">Searching locations...</div>
          )}

          {!loading && suggestions.map((location) => (
            <button
              key={`${location.label}-${location.coordinates?.coordinates?.join(",") || ""}`}
              type="button"
              role="option"
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#24305f] transition-colors hover:bg-[#f3faf5] focus:bg-[#f3faf5] focus:outline-none"
              onClick={() => selectLocation(location)}
            >
              <strong className="block truncate font-semibold">{location.label}</strong>
              <span className="block truncate text-xs text-slate-400">
                {[location.city, location.state, location.country].filter(Boolean).filter((part, index, parts) => index === 0 || part.toLowerCase() !== parts[index - 1].toLowerCase()).join(", ")}
              </span>
            </button>
          ))}

          {!loading && searchError && <div role="status" className="px-3 py-2.5 text-sm text-rose-600">{searchError}</div>}
          {!loading && !searchError && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="px-3 py-2.5 text-sm text-slate-500">No matching locations found.</div>
          )}
        </div>
      )}
    </div>
  );
}
