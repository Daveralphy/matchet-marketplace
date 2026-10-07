import { useEffect, useRef, useState } from "react";
import { searchProviderLocations } from "../api/provider";

export default function LocationSearch({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search for a city, state, or country...",
  className = "",
  disabled = false,
  required = false,
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => setQuery(value || ""), [value]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2 || term === String(value || "").trim()) {
      setSuggestions([]);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await searchProviderLocations(term);
        if (active) setSuggestions(response?.data?.locations || []);
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, value]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setSuggestions([]);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        disabled={disabled}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className="box-border w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10183f] outline-none transition focus:border-[#07983f] focus:ring-2 focus:ring-[#07983f]/10"
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          onChange?.(next);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) setSuggestions((items) => items);
        }}
      />

      {(loading || suggestions.length > 0) && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(16,24,63,0.16)]"
        >
          {loading && (
            <div className="px-3 py-2.5 text-sm text-slate-500">Searching locations...</div>
          )}

          {!loading && suggestions.map((location) => (
            <button
              key={`${location.label}-${location.coordinates?.coordinates?.join(",") || ""}`}
              type="button"
              role="option"
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#24305f] hover:bg-[#f3faf5]"
              onClick={() => {
                setQuery(location.label);
                setSuggestions([]);
                onChange?.(location.label);
                onSelect?.(location);
              }}
            >
              <strong className="block truncate">{location.label}</strong>
              <span className="block truncate text-xs text-slate-400">
                {[location.city, location.state, location.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="px-3 py-2.5 text-sm text-slate-500">No matching locations found.</div>
          )}
        </div>
      )}
    </div>
  );
}
