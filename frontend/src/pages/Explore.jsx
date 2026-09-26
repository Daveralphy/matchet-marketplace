// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/inspirations/explore/hero.png";
import { getCategoryCollections, getMarketplaceData, getProviderCollection } from "../data/marketplaceApi";

const LOCATION_OPTIONS = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Port Harcourt, Nigeria",
  "Kano, Nigeria",
  "Ibadan, Nigeria",
];

function Icon({ name, size = 18, strokeWidth = 1.9 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),

    monitor: (
      <>
        <rect x="3.5" y="4" width="17" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),

    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),

    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),

    leaf: (
      <path d="M20 4C10 4 4 9 4 16c0 2.2 1.8 4 4 4 7 0 12-6 12-16ZM4 20c2-4 5-7 10-9" />
    ),

    tools: (
      <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),

    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),

    chevronDown: <path d="m6 9 6 6 6-6" />,

    chevronUp: <path d="m6 15 6-6 6 6" />,

    products: (
      <>
        <path d="M6 7h12l1.5 13h-15L6 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </>
    ),

    service: (
      <>
        <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />
      </>
    ),

    sparkles: <path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3ZM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />,

    provider: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M4 20c.9-3.5 3.5-5.5 8-5.5s7.1 2 8 5.5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function LocationSelect({
  selectedLocation,
  setSelectedLocation,
  locationOpen,
  setLocationOpen,
  locationRef,
}) {
  return (
    <div ref={locationRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setLocationOpen((open) => !open)}
        className={[
          "flex h-12 w-full min-w-0 items-center gap-2 border-l border-slate-100 px-3 text-left text-[12px] font-medium text-[#10183f] transition-colors sm:h-[54px] sm:px-4",
          locationOpen ? "text-[#07983f]" : "",
        ].join(" ")}
        aria-expanded={locationOpen}
        aria-haspopup="listbox"
      >
        <Icon name="pin" size={18} />

        <span className="min-w-0 flex-1 truncate">
          {selectedLocation}
        </span>

        <Icon
          name={locationOpen ? "chevronUp" : "chevronDown"}
          size={15}
        />
      </button>

      {locationOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_14px_30px_rgba(16,24,63,0.14)] sm:left-auto sm:right-0 sm:w-[250px]">
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
            <Icon name="search" size={16} />

            <input
              type="text"
              placeholder="Search for a city or state..."
              className="min-w-0 w-full bg-transparent text-[12px] text-[#24305f] outline-none placeholder:text-slate-400"
            />
          </div>

          <div role="listbox" aria-label="Select location">
            {LOCATION_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === selectedLocation}
                onClick={() => {
                  setSelectedLocation(option);
                  setLocationOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] text-[#24305f] transition-colors hover:bg-slate-50",
                  option === selectedLocation
                    ? "bg-[#effaf3] text-[#07863a]"
                    : "",
                ].join(" ")}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon name="pin" size={15} />
                  <span className="truncate">{option}</span>
                </span>

                {option === selectedLocation && (
                  <span className="ml-2 shrink-0 font-semibold text-[#07983f]">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchBar({
  selectedLocation,
  setSelectedLocation,
  locationOpen,
  setLocationOpen,
  locationRef,
}) {
  return (
    <div className="flex w-full max-w-[520px] flex-col rounded-[15px] bg-white p-1.5 shadow-[0_8px_24px_rgba(16,24,63,0.08)] sm:flex-row sm:items-center">
      <div className="flex h-12 min-w-0 w-full items-center gap-2 px-3 sm:h-[54px] sm:w-auto sm:flex-1">
        <Icon name="search" size={20} />

        <input
          type="search"
          placeholder="Search for products, services, or providers..."
          aria-label="Search for products, services, or providers"
          className="min-w-0 flex-1 bg-transparent text-[11px] text-[#10183f] outline-none placeholder:text-[#8790ae] sm:text-[12px]"
        />
      </div>

      <div className="h-px w-full bg-slate-100 sm:h-[34px] sm:w-px" />

      <LocationSelect
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locationOpen={locationOpen}
        setLocationOpen={setLocationOpen}
        locationRef={locationRef}
      />

      <button
        type="button"
        className="mt-1 h-12 w-full shrink-0 rounded-[11px] bg-[#07983f] px-6 text-[12px] font-semibold text-white transition-colors hover:bg-[#068936] sm:mt-0 sm:h-[54px] sm:w-auto sm:px-7 sm:text-[13px]"
      >
        Search
      </button>
    </div>
  );
}

function CategoryPills() {
  const categories = [
    { label: "All Categories", icon: "grid", active: true },
    { label: "Products", icon: "bag" },
    { label: "Services", icon: "tools" },
    { label: "Providers", icon: "provider" },
  ];

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex w-full gap-2.5 overflow-x-auto pb-1 pr-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={
              category.label === "Services"
                ? "/services"
                : category.label === "Products"
                  ? "/products"
                  : category.label === "Providers"
                    ? "/for-providers"
                    : "/explore"
            }
            className={[
              "flex min-h-[39px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[11px] px-3.5 py-2 text-[11px] font-medium transition-colors sm:text-[12px]",
              category.active
                ? "bg-[#dff7e7] text-[#07863a]"
                : "bg-white text-[#10183f] hover:bg-slate-50",
            ].join(" ")}
          >
            <Icon name={category.icon} size={16} />
            <span>{category.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExploreCard({
  icon,
  title,
  description,
  className,
  tone = "bg-[#e4f9e9] text-[#07983f]",
}) {
  return (
    <div
      className={`absolute z-30 hidden rounded-[15px] bg-white px-3.5 py-3 shadow-[0_8px_24px_rgba(16,24,63,0.08)] lg:block ${className}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}
        >
          <Icon name={icon} size={20} />
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-[15px] text-[#10183f] sm:text-[12px]">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] leading-4 text-[#7b84a3] sm:text-[10px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DesktopExploreCards({ isAuthenticated }) {
  if (isAuthenticated) {
    return (
      <>
        <ExploreCard
          icon="sparkles"
          title="Picked for you"
          description="Based on your interests"
          tone="bg-[#e4f9e9] text-[#07983f]"
          className="left-[10%] top-[23%] w-[205px] xl:left-[15%] xl:w-[220px]"
        />

        <ExploreCard
          icon="pin"
          title="Near you"
          description="Find great options in Lagos"
          tone="bg-[#e5efff] text-[#2866d6]"
          className="right-[3%] top-[27%] w-[200px] xl:w-[215px]"
        />

        <ExploreCard
          icon="heart"
          title="Popular this week"
          description="What others are exploring"
          tone="bg-[#ffe9e7] text-[#ef4d3f]"
          className="left-[5%] bottom-[14%] w-[205px] xl:left-[15%] xl:w-[220px]"
        />
      </>
    );
  }

  return (
    <>
      <ExploreCard
        icon="bag"
        title="Products"
        description="Everyday essentials and more"
        tone="bg-[#e4f9e9] text-[#07983f]"
        className="left-[10%] top-[30%] w-[205px] xl:left-[25%] xl:w-[220px]"
      />

      <ExploreCard
        icon="tools"
        title="Services"
        description="Skilled help when you need it"
        tone="bg-[#f0e8ff] text-[#6d31db]"
        className="right-[3%] top-[20%] w-[200px] xl:w-[215px]"
      />

      <ExploreCard
        icon="provider"
        title="Providers"
        description="Trusted people and businesses"
        tone="bg-[#fff0df] text-[#e77b13]"
        className="left-[5%] bottom-[25%] w-[205px] xl:left-[17%] xl:w-[220px]"
      />
    </>
  );
}

function HeroVisual({ isAuthenticated }) {
  return (
    <div className="relative hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:h-full lg:w-[58%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_48%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_42%,rgba(248,250,249,0)_76%)]" />

      <img
        src={heroImage}
        alt=""
        className="absolute left-[60%] top-1/2 h-[99%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:h-[95%]"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#fbfcfb] via-[#fbfcfb]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#fbfcfb]/70 to-transparent" />

      <DesktopExploreCards isAuthenticated={isAuthenticated} />
    </div>
  );
}


function HeartButton() {
  return (
    <button
      type="button"
      aria-label="Save item"
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_2px_8px_rgba(16,24,63,0.12)]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
      </svg>
    </button>
  );
}


function ProviderCard({ provider }) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-[#e4e9f0] bg-white shadow-[0_5px_18px_rgba(16,24,63,0.05)]">
      <div className="relative h-[150px]">
        <div className={`flex h-full w-full items-center justify-center ${provider.imageTone}`}>
          <Icon name="provider" size={72} strokeWidth={1.2} />
        </div>
        {provider.match && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-[#07863a] shadow-sm">
            ✦ {provider.match}
          </span>
        )}
        <button
          type="button"
          aria-label={`Save ${provider.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#10183f] shadow-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
          </svg>
        </button>
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${provider.logoTone}`}>
            {provider.initials}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold text-[#10183f]">
              {provider.name} <span className="text-[#2682e9]">●</span>
            </h3>
            <p className="mt-0.5 truncate text-[10px] text-[#747d9e]">{provider.category}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-[10px] text-[#27335f]">
          <p><span className="mr-2 text-[#f4b400]">★</span><strong>{provider.rating}</strong> <span className="text-[#7b84a3]">({provider.reviews} reviews)</span></p>
          <p><span className="mr-2 text-[#10183f]">⌖</span>{provider.location}</p>
          <p><span className="mr-2 text-[#10183f]">▱</span>{provider.listings} listings</p>
        </div>

        <button type="button" className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#e9f9ed] text-[11px] font-semibold text-[#07863a]">
          View profile <span className="text-[16px]">→</span>
        </button>
      </div>
    </article>
  );
}

function ProvidersSection({ isAuthenticated }) {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    let active = true;
    getProviderCollection(isAuthenticated ? "recommended" : "featured").then((items) => {
      if (active) setProviders(items);
    });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const title = isAuthenticated ? (
    <>People <span className="text-[#07863a]">worth knowing.</span></>
  ) : (
    <>Discover <span className="text-[#07863a]">trusted providers.</span></>
  );

  return (
    <section className={`mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-7 sm:py-8 lg:px-9 lg:py-9 ${isAuthenticated ? "bg-[#f5fcf8]" : "bg-[#fbfcfb]"}`}>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[10px]">
            {isAuthenticated ? "PROVIDERS FOR YOU" : "MEET THE COMMUNITY"}
          </p>
          <h2 className="mt-2 text-[31px] font-bold leading-none tracking-[-0.045em] text-[#10183f] sm:text-[42px]">
            {title}
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#69739a] sm:text-[15px]">
            {isAuthenticated
              ? "Discover providers based on your interests, location, and previous activity."
              : "Find skilled people and businesses ready to help with what you need."}
          </p>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button type="button" aria-label="Previous providers" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_2px_10px_rgba(16,24,63,0.05)]">‹</button>
          <button type="button" aria-label="Next providers" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_2px_10px_rgba(16,24,63,0.05)]">›</button>
          <button type="button" className="ml-3 flex h-11 items-center gap-2 rounded-full bg-[#e6f8eb] px-5 text-[11px] font-semibold text-[#07863a]">
            View all providers <span className="text-[16px]">→</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
      </div>
    </section>
  );
}

function ExploreProductCard({ item, listView = false }) {
  return (
    <Link to={item.type === "service" ? `/services/${item.id}` : `/products/${item.id}`} className={listView ? "flex overflow-hidden rounded-[10px] border border-[#e4e9f0] bg-white" : "block overflow-hidden rounded-[10px] border border-[#e4e9f0] bg-white"}>
      <div className={listView ? "relative h-[125px] w-[145px] shrink-0" : "relative h-[105px] w-full"}>
        <div className={`flex h-full w-full items-center justify-center ${item.imageTone}`}>
          <Icon name={item.icon} size={58} strokeWidth={1.15} />
        </div>
        <HeartButton />
      </div>

      <div className={listView ? "min-w-0 flex-1 px-3 py-2.5" : "px-2.5 pb-2.5 pt-2"}>
        <div className="flex items-center justify-between gap-1.5">
          <span className={`max-w-[105px] truncate text-[8px] font-medium text-[#6f7899] ${listView ? "text-[9px]" : ""}`}>
            {item.category}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-[8px] font-semibold text-[#10183f]">
            <span className="text-[#f4b400]">★</span>{item.rating}
          </span>
        </div>

        <h3 className="mt-1.5 truncate text-[10px] font-semibold leading-4 text-[#10183f] sm:text-[11px]">
          {item.title}
        </h3>

        <p className="mt-1 text-[11px] font-bold leading-4 text-[#07863a]">
          {item.price}
        </p>

        <p className="mt-1 truncate text-[8px] text-[#7b84a3]">
          {item.seller} · {item.location}
        </p>
      </div>
    </Link>
  );
}

function ResultsControl({ icon, children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-[10px] font-medium transition-colors sm:h-10 sm:px-4 sm:text-[11px] ${active ? "border-transparent bg-[#dff7e7] text-[#07863a]" : "border-[#e4e9f0] bg-white text-[#10183f] hover:bg-[#f7faf8]"}`}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}


function CategoryIcon({ name, size = 25 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    bag: <><path d="M5 9h14l-1 11H6L5 9Z" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></>,
    shirt: <path d="m8 4 4 2 4-2 4 4-3 2v10H7V10L4 8l4-4Z" />,
    chair: <><path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" /><path d="M5 11h14v4H5zM7 15v4M17 15v4" /></>,
    lotus: <path d="M12 20c-4.5 0-8-2.6-8-6.5 0-2.6 1.4-4.5 3.5-5.5.1 3.2 1.8 5.2 4.5 6.2-1.2-3.7.3-7.2 0-10.2 3 1.5 4.5 4.2 4 7.3 1.2-1.5 2.8-2.5 4.5-2.9.5 5-2.7 9.6-8.5 11.6Z" />,
    laptop: <><rect x="5" y="4" width="14" height="11" rx="1.5" /><path d="M3 19h18M8 19l1-2h6l1 2" /></>,
    monitor: <><rect x="4" y="4" width="16" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></>,
    car: <><path d="m5 16 1.5-6h11L19 16" /><path d="M4 16h16v3H4zM7 12h10M7 19v1M17 19v1" /></>,
    tools: <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />,
    paintbrush: <><path d="m14 4 6 6" /><path d="m3 21 3.5-1 9.5-9.5-5-5L1.5 15 3 21Z" /></>,
    gamepad: <path d="M7 9h10c2 0 4 2.4 4 5.5 0 3-1.2 4.5-2.8 4.5-1.2 0-2.3-1.1-3.2-2.5H9c-.9 1.4-2 2.5-3.2 2.5C4.2 19 3 17.5 3 14.5 3 11.4 5 9 7 9Z" />,
    dots: <><circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  };
  return <svg {...common}>{paths[name] || paths.dots}</svg>;
}

const CATEGORY_TONES = {
  green: "bg-[#e2f8e8] text-[#07863a]",
  red: "bg-[#ffe5e5] text-[#db2e35]",
  yellow: "bg-[#fff1cb] text-[#9b6a00]",
  pink: "bg-[#fde4f5] text-[#bd2b9b]",
  purple: "bg-[#eee3ff] text-[#6426d7]",
  blue: "bg-[#e4efff] text-[#2167d7]",
  orange: "bg-[#ffebdc] text-[#c36312]",
  gray: "bg-[#f0f0f0] text-[#333333]",
};

function CategoryTile({ category }) {
  return (
    <Link
      to={category.id === "services" ? "/services" : "/explore"}
      className="flex h-[118px] items-center gap-4 rounded-[11px] border border-[#e3e8f0] bg-white px-4 transition-shadow hover:shadow-[0_6px_18px_rgba(16,24,63,0.06)] sm:h-[118px] sm:px-5"
    >
      <span className={`flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full ${CATEGORY_TONES[category.tone]}`}>
        <CategoryIcon name={category.icon} size={29} />
      </span>
      <span className="min-w-0 flex-1 text-[12px] font-semibold text-[#10183f] sm:text-[13px]">{category.name}</span>
      <span className="text-[21px] text-[#10183f]">›</span>
    </Link>
  );
}

function CategoriesSection({ isAuthenticated }) {
  const [categories, setCategories] = useState({ featured: [], interests: [], exploreMore: [] });

  useEffect(() => {
    let active = true;
    getCategoryCollections().then((data) => {
      if (active) setCategories(data);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 bg-[#fbfcfb] px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-8 sm:py-9 lg:px-9 lg:py-10">
      <div className="flex items-start justify-between gap-5">
        <div className="max-w-[700px]">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[10px]">
            {isAuthenticated ? "EXPLORE YOUR INTERESTS" : "EXPLORE BY CATEGORY"}
          </p>
          <h2 className="mt-2 text-[34px] font-bold leading-[1.02] tracking-[-0.045em] text-[#10183f] sm:text-[48px]">
            {isAuthenticated ? (
              <>What would you like<br /><span className="text-[#07863a]">to explore?</span></>
            ) : (
              <>Find something that<br /><span className="text-[#07863a]">fits your needs.</span></>
            )}
          </h2>
          <p className="mt-2 max-w-[620px] text-[13px] leading-5 text-[#69739a] sm:text-[17px] sm:leading-6">
            {isAuthenticated
              ? "Jump into your favourite categories or discover something new."
              : "Start with a category and discover products, services, and providers around you."}
          </p>
        </div>

        <button type="button" className="hidden shrink-0 items-center gap-2 rounded-full bg-[#e9f9ed] px-5 py-3 text-[11px] font-semibold text-[#07863a] sm:flex">
          View all categories <span className="text-[16px]">→</span>
        </button>
      </div>

      {isAuthenticated ? (
        <>
          <div className="mt-7 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#10183f]">Your interests</h3>
            <button type="button" className="text-[11px] font-semibold text-[#07863a]">Edit interests <span className="ml-1 text-[15px]">→</span></button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.interests.map((category) => <CategoryTile key={category.id} category={category} />)}
          </div>
          <div className="my-5 border-t border-[#e8ecf1]" />
          <h3 className="text-[15px] font-semibold text-[#10183f]">Explore more</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.exploreMore.map((category) => <CategoryTile key={category.id} category={category} />)}
          </div>
        </>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.featured.map((category) => <CategoryTile key={category.id} category={category} />)}
        </div>
      )}
    </section>
  );
}

function ExploreResultsSection({ isAuthenticated }) {
  const [sourceItems, setSourceItems] = useState([]);
  const [activeTab, setActiveTab] = useState(isAuthenticated ? "recommended" : "all");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Lagos");
  const [sortBy, setSortBy] = useState("relevance");
  const [listView, setListView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    let active = true;

    getMarketplaceData().then(({ products, services }) => {
      if (!active) return;
      setSourceItems([...products, ...services]);
    });

    return () => {
      active = false;
    };
  }, []);

  const tabs = [
    { id: "all", label: "All", icon: "grid" },
    { id: "products", label: "Products", icon: "products" },
    { id: "services", label: "Services", icon: "service" },
    { id: "providers", label: "Providers", icon: "provider" },
  ];

  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = sourceItems
    .filter((item) => {
      if (activeTab === "products") return item.type === "product";
      if (activeTab === "services") return item.type === "service";
      if (activeTab === "providers") return true;
      return true;
    })
    .filter((item) => {
      if (!normalizedSearch) return true;
      return [item.title, item.category, item.seller, item.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .filter((item) => !selectedLocation || item.location === selectedLocation)
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(String(a.price).replace(/[^0-9]/g, "")) - Number(String(b.price).replace(/[^0-9]/g, ""));
      }
      if (sortBy === "price-high") {
        return Number(String(b.price).replace(/[^0-9]/g, "")) - Number(String(a.price).replace(/[^0-9]/g, ""));
      }
      if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
      return 0;
    });

  const visibleItems = filteredItems.slice(0, visibleCount);

  const updateTab = (tab) => {
    setActiveTab(tab);
    setVisibleCount(12);
  };

  return (
    <section className="mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 bg-[#fbfcfb] px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[10px]">
            {isAuthenticated ? "EXPLORE FOR YOU" : "DISCOVER ON MATCHET"}
          </p>

          <h2 className="mt-2 text-[32px] font-bold leading-[0.98] tracking-[-0.045em] text-[#10183f] sm:text-[43px]">
            {isAuthenticated ? (
              <>More of what <span className="text-[#07863a]">matches you.</span></>
            ) : (
              <>Explore what’s <span className="text-[#07863a]">available.</span></>
            )}
          </h2>

          <p className="mt-2 text-[12px] leading-5 text-[#69739a] sm:text-[14px]">
            {isAuthenticated
              ? "Browse recommendations, nearby options, and everything else available on Matchet."
              : "Browse products, services, and providers from around you."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start">
          <span className="text-[10px] font-semibold text-[#7b84a3] sm:text-[11px]">
            {filteredItems.length.toLocaleString("en-NG")} results
          </span>
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setListView(false)}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${!listView ? "bg-[#dff7e7] text-[#07863a]" : "bg-white text-[#69739a]"}`}
          >
            <Icon name="grid" size={16} />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setListView(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${listView ? "bg-[#dff7e7] text-[#07863a]" : "bg-white text-[#69739a]"}`}
          >
            <span className="text-[15px] leading-none">☷</span>
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {isAuthenticated && (
          <ResultsControl icon="sparkles" active={activeTab === "recommended"} onClick={() => updateTab("recommended")}>
            Recommended
          </ResultsControl>
        )}
        {tabs.map((tab) => (
          <ResultsControl
            key={tab.id}
            icon={tab.icon}
            active={activeTab === tab.id}
            onClick={() => updateTab(tab.id)}
          >
            {tab.label}
          </ResultsControl>
        ))}

        <div className="ml-0 flex h-9 min-w-[210px] flex-1 items-center gap-2 rounded-full border border-[#e4e9f0] bg-white px-3.5 sm:h-10 sm:min-w-[260px]">
          <Icon name="search" size={15} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search within results..."
            className="min-w-0 flex-1 bg-transparent text-[10px] text-[#10183f] outline-none placeholder:text-[#8790ae] sm:text-[11px]"
          />
        </div>

        <select
          value={selectedLocation}
          onChange={(event) => setSelectedLocation(event.target.value)}
          className="h-9 rounded-full border border-[#e4e9f0] bg-white px-3 text-[10px] font-medium text-[#10183f] outline-none sm:h-10 sm:px-4 sm:text-[11px]"
          aria-label="Location"
        >
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
          <option value="Kano">Kano</option>
        </select>

        <ResultsControl icon="grid">Filters</ResultsControl>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-9 rounded-full border border-[#e4e9f0] bg-white px-3 text-[10px] font-medium text-[#10183f] outline-none sm:h-10 sm:px-4 sm:text-[11px]"
          aria-label="Sort results"
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="rating">Highest rated</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
        </select>
      </div>

      <div className={listView ? "mt-5 grid gap-3 sm:grid-cols-2" : "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"}>
        {visibleItems.map((item) => (
          <ExploreProductCard key={item.title} item={item} listView={listView} />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <div className="mt-5 rounded-xl border border-dashed border-[#d8dfe8] bg-white px-5 py-12 text-center text-[12px] text-[#69739a]">
          No results match your current search and filters.
        </div>
      )}

      {visibleCount < filteredItems.length && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 12)}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-[#e7f8ec] px-6 text-[10px] font-semibold text-[#07863a] transition-colors hover:bg-[#d9f3e1]"
          >
            Load more results <span className="text-[16px]">→</span>
          </button>
        </div>
      )}
    </section>
  );
}

export default function Explore({ isAuthenticated = false }) {
  const [selectedLocation, setSelectedLocation] = useState("Lagos, Nigeria");
  const [locationOpen, setLocationOpen] = useState(false);

  const locationRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        locationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [locationOpen]);

  return (
    <main className="w-full px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-[#fbfcfb] shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="relative min-h-0 lg:min-h-[535px]">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-0 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[51%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
              {isAuthenticated ? "EXPLORE FOR YOU" : "EXPLORE MATCHET"}
            </p>

            <h1 className="mt-4 max-w-[520px] text-[36px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[48px] lg:text-[43px] xl:text-[48px]">
              {isAuthenticated ? (
                <>
                  Discover your
                  <br />
                  <span className="text-[#07863a]">next match.</span>
                </>
              ) : (
                <>
                  Discover more.
                  <br />
                  <span className="text-[#07863a]">Find what fits.</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-[475px] text-[14px] leading-[22px] text-[#69739a] sm:text-[15px] sm:leading-6">
              {isAuthenticated
                ? "Explore recommendations, new finds, and trusted providers based on what interests you."
                : "Browse products, services, and trusted providers all in one place."}
            </p>

            <div className="mt-6">
              <SearchBar
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                locationOpen={locationOpen}
                setLocationOpen={setLocationOpen}
                locationRef={locationRef}
              />
            </div>

            <div className="mt-4">
              <CategoryPills />
            </div>
          </div>

          <HeroVisual isAuthenticated={isAuthenticated} />
        </div>
      </section>

      <ExploreResultsSection isAuthenticated={isAuthenticated} />
      <ProvidersSection isAuthenticated={isAuthenticated} />
      <CategoriesSection isAuthenticated={isAuthenticated} />
    </main>
  );
}