// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/explore/hero.png";

const CATEGORIES = [
  { label: "All", icon: "grid", active: true, to: "/explore" },
  { label: "Products", icon: "bag", to: "/products" },
  { label: "Services", icon: "tools", to: "/services" },
  { label: "Providers", icon: "user", to: "/for-providers" },
];

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
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    tools: (
      <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
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
    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.4-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
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
  const [locationQuery, setLocationQuery] = useState("");

  const filteredLocations = LOCATION_OPTIONS.filter((option) =>
    option.toLowerCase().includes(locationQuery.toLowerCase()),
  );

  return (
    <div ref={locationRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setLocationOpen((open) => !open)}
        className={[
          "flex h-12 w-full min-w-0 items-center gap-2 px-3 text-left text-[12px] font-medium text-[#10183f] transition-colors sm:h-[52px] sm:px-4",
          locationOpen ? "text-[#07863a]" : "",
        ].join(" ")}
        aria-expanded={locationOpen}
        aria-haspopup="listbox"
      >
        <Icon name="pin" size={17} />

        <span className="min-w-0 flex-1 truncate">
          {selectedLocation.replace(", Nigeria", "")}
        </span>

        <Icon
          name={locationOpen ? "chevronUp" : "chevronDown"}
          size={14}
        />
      </button>

      {locationOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_14px_30px_rgba(16,24,63,0.14)] sm:left-auto sm:right-0 sm:w-[245px]">
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
            <Icon name="search" size={15} />

            <input
              autoFocus
              type="text"
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              placeholder="Search location..."
              className="min-w-0 w-full bg-transparent text-[12px] text-[#24305f] outline-none placeholder:text-slate-400"
            />
          </div>

          <div role="listbox" aria-label="Select location">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === selectedLocation}
                  onClick={() => {
                    setSelectedLocation(option);
                    setLocationOpen(false);
                    setLocationQuery("");
                  }}
                  className={[
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] text-[#24305f] transition-colors hover:bg-slate-50",
                    option === selectedLocation
                      ? "bg-[#effaf3] text-[#07863a]"
                      : "",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon name="pin" size={14} />
                    <span className="truncate">{option}</span>
                  </span>

                  {option === selectedLocation && (
                    <span className="ml-2 shrink-0 font-semibold text-[#07983f]">
                      ✓
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="px-3 py-3 text-[11px] text-slate-400">
                No locations found.
              </p>
            )}
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
    <div className="flex w-full max-w-[550px] flex-col rounded-[15px] bg-white p-1.5 shadow-[0_8px_24px_rgba(16,24,63,0.08)] sm:flex-row sm:items-center">
      <div className="flex h-12 min-w-0 w-full items-center gap-2 px-3 sm:h-[52px] sm:flex-1 sm:px-4">
        <Icon name="search" size={19} />

        <input
          type="search"
          placeholder="Search products, services, or providers..."
          aria-label="Search products, services, or providers"
          className="min-w-0 flex-1 bg-transparent text-[11px] text-[#10183f] outline-none placeholder:text-[#8790ae] sm:text-[12px]"
        />
      </div>

      <div className="h-px w-full bg-slate-100 sm:h-[32px] sm:w-px" />

      <LocationSelect
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locationOpen={locationOpen}
        setLocationOpen={setLocationOpen}
        locationRef={locationRef}
      />

      <button
        type="button"
        aria-label="Search"
        className="mt-1 flex h-12 w-full shrink-0 items-center justify-center rounded-[12px] bg-[#07983f] text-white transition-colors hover:bg-[#068936] sm:mt-0 sm:h-[52px] sm:w-[52px]"
      >
        <Icon name="arrow" size={20} strokeWidth={2.1} />
      </button>
    </div>
  );
}

function CategoryPills() {
  return (
    <div className="flex w-full max-w-[600px] gap-2.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
      {CATEGORIES.map((category) => (
        <Link
          key={category.label}
          to={category.to}
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
  );
}

function ExploreFeatureCard({ icon, title, description, tone }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[15px] border border-white/70 bg-white/95 px-3.5 py-3 shadow-[0_8px_24px_rgba(16,24,63,0.08)] backdrop-blur-sm">
      <span
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          tone,
        ].join(" ")}
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

      <Icon name="chevronDown" size={14} />
    </div>
  );
}

function DesktopExploreCards({ isAuthenticated }) {
  if (isAuthenticated) {
    return (
      <>
        <div className="absolute left-[5%] top-[18%] z-30 hidden w-[210px] lg:block xl:w-[220px]">
          <ExploreFeatureCard
            icon="sparkles"
            title="Picked for you"
            description="Based on your interests"
            tone="bg-[#e8faec] text-[#07983f]"
          />
        </div>

        <div className="absolute right-[1%] top-[22%] z-30 hidden w-[185px] lg:block xl:w-[195px]">
          <ExploreFeatureCard
            icon="pin"
            title="Near you"
            description="Find great options in Lagos"
            tone="bg-[#e8f1ff] text-[#2866d6]"
          />
        </div>

        <div className="absolute left-[9%] bottom-[15%] z-30 hidden w-[220px] lg:block xl:w-[230px]">
          <ExploreFeatureCard
            icon="heart"
            title="Popular this week"
            description="What others are exploring"
            tone="bg-[#fff0f1] text-[#ef5a64]"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute left-[4%] top-[23%] z-30 hidden w-[210px] lg:block xl:w-[220px]">
        <ExploreFeatureCard
          icon="bag"
          title="Products"
          description="Everyday essentials and more"
          tone="bg-[#e8faec] text-[#07983f]"
        />
      </div>

      <div className="absolute right-[1%] top-[27%] z-30 hidden w-[205px] lg:block xl:w-[215px]">
        <ExploreFeatureCard
          icon="tools"
          title="Services"
          description="Skilled help when you need it"
          tone="bg-[#f0e8ff] text-[#6d31db]"
        />
      </div>

      <div className="absolute left-[8%] bottom-[14%] z-30 hidden w-[210px] lg:block xl:w-[220px]">
        <ExploreFeatureCard
          icon="user"
          title="Providers"
          description="Trusted people and businesses"
          tone="bg-[#fff3e5] text-[#e17b12]"
        />
      </div>
    </>
  );
}

function HeroVisual({ isAuthenticated }) {
  return (
    <div className="relative hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:h-full lg:w-[58%]">
      <img
        src={heroImage}
        alt=""
        className="absolute left-[51%] top-1/2 h-[94%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:h-[98%]"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[23%] bg-gradient-to-r from-[#fbfcfb] via-[#fbfcfb]/70 to-transparent" />

      <DesktopExploreCards isAuthenticated={isAuthenticated} />
    </div>
  );
}

function MobileFeatureCards({ isAuthenticated }) {
  const cards = isAuthenticated
    ? [
        {
          icon: "sparkles",
          title: "Picked for you",
          description: "Based on your interests",
          tone: "bg-[#e8faec] text-[#07983f]",
        },
        {
          icon: "pin",
          title: "Near you",
          description: "Find great options in Lagos",
          tone: "bg-[#e8f1ff] text-[#2866d6]",
        },
        {
          icon: "heart",
          title: "Popular this week",
          description: "What others are exploring",
          tone: "bg-[#fff0f1] text-[#ef5a64]",
        },
      ]
    : [
        {
          icon: "bag",
          title: "Products",
          description: "Everyday essentials and more",
          tone: "bg-[#e8faec] text-[#07983f]",
        },
        {
          icon: "tools",
          title: "Services",
          description: "Skilled help when you need it",
          tone: "bg-[#f0e8ff] text-[#6d31db]",
        },
        {
          icon: "user",
          title: "Providers",
          description: "Trusted people and businesses",
          tone: "bg-[#fff3e5] text-[#e17b12]",
        },
      ];

  return (
    <div className="grid gap-3 border-t border-slate-100 bg-white/70 p-4 lg:hidden">
      {cards.map((card) => (
        <ExploreFeatureCard key={card.title} {...card} />
      ))}
    </div>
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
      <section
        className={[
          "relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 shadow-[0_10px_35px_rgba(16,24,63,0.05)]",
          isAuthenticated ? "bg-[#f4fbf6]" : "bg-[#fbfcfb]",
        ].join(" ")}
      >
        <div className="relative min-h-0 lg:min-h-[535px]">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-8 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[52%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
              {isAuthenticated ? "EXPLORE FOR YOU" : "EXPLORE MATCHET"}
            </p>

            <h1 className="mt-4 max-w-[500px] text-[38px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[50px] lg:text-[46px] xl:text-[50px]">
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

            <p className="mt-4 max-w-[460px] text-[14px] leading-[22px] text-[#69739a] sm:text-[15px] sm:leading-6">
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

            <div className="mt-10 hidden sm:block lg:mt-12">
              <div className="h-[2px] w-8 bg-[#07983f]" />

              <p className="mt-3 text-[13px] font-semibold text-[#10183f]">
                {isAuthenticated
                  ? "Curated for what matters to you."
                  : "More to explore."}
              </p>

              <p className="mt-0.5 text-[11px] text-[#7b84a3]">
                {isAuthenticated
                  ? "Better matches. More possibilities."
                  : "Great finds, trusted people, real opportunities."}
              </p>
            </div>
          </div>

          <HeroVisual isAuthenticated={isAuthenticated} />
        </div>

        <MobileFeatureCards isAuthenticated={isAuthenticated} />
      </section>
    </main>
  );
}
