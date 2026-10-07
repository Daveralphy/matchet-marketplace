import LocationSearch from "./LocationSearch";

export default function MarketplaceLocationSelect({ selectedLocation, setSelectedLocation, locationOpen, setLocationOpen, locationRef }) {
  return (
    <div ref={locationRef} className="relative min-w-0 flex-1">
      <LocationSearch
        value={selectedLocation}
        onChange={(value) => setSelectedLocation(value)}
        onSelect={(location) => setSelectedLocation(location.label)}
        placeholder="Search for a city, state, or country..."
        className="w-full"
      />
    </div>
  );
}
