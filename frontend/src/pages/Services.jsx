// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import heroImageLoggedOut from "../assets/inspirations/services/hero 1.png";
import heroImageLoggedIn from "../assets/inspirations/services/hero 2.png";
import { getServiceCollection } from "../data/marketplaceApi";

const LOCATION_OPTIONS = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Port Harcourt, Nigeria",
  "Kano, Nigeria",
  "Ibadan, Nigeria",
];

const SERVICE_CATEGORIES = [
  { label: "Home Services", icon: "home" },
  { label: "Repairs", icon: "tools" },
  { label: "Beauty & Care", icon: "beauty" },
  { label: "Professional Services", icon: "briefcase" },
  { label: "Events", icon: "calendar" },
  { label: "More", icon: "more" },
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

    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),

    tools: (
      <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />
    ),

    beauty: (
      <>
        <path d="M12 20c-4.5 0-7-3.2-7-7 0-3.4 2.1-6.1 5.1-7.2C11 4.9 12 3 12 3s1 1.9 1.9 2.8C16.9 6.9 19 9.6 19 13c0 3.8-2.5 7-7 7Z" />
        <path d="M8 13c1.3-1 2.7-1 4 0s2.7 1 4 0" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3.5" y="7" width="17" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3.5 11h17M10 11v2h4v-2" />
      </>
    ),

    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),

    more: (
      <>
        <circle
          cx="6"
          cy="12"
          r="1.5"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="18"
          cy="12"
          r="1.5"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),

    shield: (
      <path d="M12 3 19 6v5c0 4.8-3 8.2-7 10-4-1.8-7-5.2-7-10V6l7-3Z" />
    ),

    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M17 14a5 5 0 0 1 4 6" />
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
          placeholder="Search for a service, skill, or provider..."
          aria-label="Search for a service, skill, or provider"
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

function ServiceCategories() {
  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex w-full gap-2.5 overflow-x-auto pb-1 pr-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
        {SERVICE_CATEGORIES.map((category, index) => (
          <button
            key={category.label}
            type="button"
            className="flex min-h-[58px] w-[78px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[14px] text-[9px] font-medium text-[#10183f] transition-colors hover:bg-white sm:w-[82px] sm:text-[10px]"
          >
            <span
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full",
                index === 0
                  ? "bg-[#dff7e7] text-[#07863a]"
                  : index === 1
                    ? "bg-[#e6f2ff] text-[#2470d8]"
                    : index === 2
                      ? "bg-[#ffe8f4] text-[#d93691]"
                      : index === 3
                        ? "bg-[#fff0d9] text-[#a96a13]"
                        : index === 4
                          ? "bg-[#eee8ff] text-[#7437d9]"
                          : "bg-[#eef0f4] text-[#10183f]",
              ].join(" ")}
            >
              <Icon name={category.icon} size={20} />
            </span>

            <span className="max-w-full text-center leading-[13px]">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
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

function HeroVisual({ isAuthenticated }) {
  const heroImage = isAuthenticated
    ? heroImageLoggedIn
    : heroImageLoggedOut;

  return (
    <div className="relative hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:h-full lg:w-[58%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_48%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_42%,rgba(248,250,249,0)_76%)]" />

      <img
        src={heroImage}
        alt=""
        className="absolute left-[55%] top-[48%] h-[99%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:h-[90%]"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#f5fbf5] via-[#f5fbf5]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#f5fbf5]/70 to-transparent" />

      {isAuthenticated ? (
        <>
          <ServiceCard
            icon="shield"
            title="Verified providers"
            description="Work with trusted professionals."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="left-[10%] top-[18%] w-[205px] xl:left-[15%] xl:w-[220px]"
          />

          <ServiceCard
            icon="pin"
            title="Available near you"
            description="Find services in your area."
            tone="bg-[#e5efff] text-[#2866d6]"
            className="right-[3%] top-[18%] w-[200px] xl:w-[215px]"
          />

          <ServiceCard
            icon="users"
            title="Trusted professionals near you."
            description=""
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="right-[7%] bottom-[14%] w-[210px] xl:right-[12%] xl:w-[225px]"
          />
        </>
      ) : (
        <>
          <ServiceCard
            icon="shield"
            title="Verified providers"
            description="Work with trusted professionals."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="left-[10%] top-[18%] w-[205px] xl:left-[15%] xl:w-[220px]"
          />

          <ServiceCard
            icon="pin"
            title="Available near you"
            description="Find services in your area."
            tone="bg-[#e5efff] text-[#2866d6]"
            className="right-[3%] top-[18%] w-[200px] xl:w-[215px]"
          />

          <ServiceCard
            icon="users"
            title="Book with confidence"
            description="A safer, simpler way to get things done."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="right-[7%] bottom-[14%] w-[210px] xl:right-[12%] xl:w-[225px]"
          />
        </>
      )}
    </div>
  );
}


function ServiceListingCard({ service }) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#e3e8ee] bg-white shadow-[0_7px_20px_rgba(16,24,63,0.045)]">
      <div className={`relative h-[218px] overflow-hidden ${service.imageTone || "bg-[#dfe7e2]"}`}>
        {service.image ? (
          <img src={service.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/45 text-[#10183f]/70 backdrop-blur-[2px]">
              <Icon name={service.category === "Beauty & Care" ? "beauty" : service.category === "Repairs" ? "tools" : service.category === "Food & Catering" ? "calendar" : "home"} size={42} strokeWidth={1.45} />
            </span>
          </div>
        )}

        {service.match && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#07863a] shadow-sm">
            ◈ {service.match}
          </span>
        )}

        <button
          type="button"
          aria-label={`Save ${service.title}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10183f] shadow-sm"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <h3 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#10183f]">
          {service.title}
        </h3>

        <p className="mt-2 text-[16px] font-semibold text-[#07863a]">
          {service.price}
        </p>

        <p className="mt-2 text-[11px] text-[#69739a]">
          <span className="mr-1.5 text-[15px] text-[#f4ad00]">★</span>
          <strong className="text-[#27335f]">{Number(service.rating).toFixed(1)}</strong>
          <span className="ml-1 text-[#7b84a3]">({service.reviews} reviews)</span>
        </p>

        <div className="mt-4 flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef1f3] text-[11px] font-semibold text-[#10183f]">
            {service.sellerInitial}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate text-[11px] font-semibold text-[#10183f]">
              {service.seller}
              {service.sellerVerified && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#18a34a] text-[9px] text-white">✓</span>
              )}
            </p>
            <p className="mt-0.5 text-[10px] text-[#7b84a3]">{service.location}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ServicesListingSection({ isAuthenticated }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let active = true;

    getServiceCollection(isAuthenticated ? "recommended" : "featured").then((items) => {
      if (active) setServices(items);
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  return (
    <section className={`mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 px-5 py-8 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-8 sm:py-9 lg:px-9 lg:py-10 ${isAuthenticated ? "bg-[#f5fcf7]" : "bg-[#fbfcfb]"}`}>
      <div className="flex items-start justify-between gap-5">
        <div className="max-w-[760px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#07863a] sm:text-[11px]">
            {isAuthenticated ? "SERVICES FOR YOU" : "POPULAR SERVICES"}
          </p>

          <h2 className="mt-3 text-[38px] font-bold leading-[0.98] tracking-[-0.045em] text-[#10183f] sm:text-[48px] lg:text-[52px]">
            {isAuthenticated ? (
              <>
                Services that match
                <br />
                <span className="text-[#07863a]">what you need.</span>
              </>
            ) : (
              <>
                Get things done by
                <br />
                <span className="text-[#07863a]">the right people.</span>
              </>
            )}
          </h2>

          <p className="mt-3 text-[14px] leading-5 text-[#69739a] sm:text-[17px] sm:leading-6">
            {isAuthenticated
              ? "Explore services selected around your interests, location, and activity."
              : "Explore popular services from trusted providers around Lagos."}
          </p>
        </div>

        <button type="button" className="hidden shrink-0 items-center gap-2 rounded-full bg-[#e7f8eb] px-6 py-3.5 text-[12px] font-semibold text-[#07863a] sm:flex">
          View all services <span className="text-[18px]">→</span>
        </button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceListingCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

export default function Services({ isAuthenticated = false }) {
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
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-[#f5fbf5] shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="relative min-h-0 lg:min-h-[535px]">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-0 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[51%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
              {isAuthenticated ? "SERVICES FOR YOU" : "SERVICES ON MATCHET"}
            </p>

            <h1 className="mt-4 max-w-[520px] text-[36px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[48px] lg:text-[43px] xl:text-[48px]">
              {isAuthenticated ? (
                <>
                  Find help that
                  <br />
                  <span className="text-[#07863a]">
                    fits your needs.
                  </span>
                </>
              ) : (
                <>
                  Find the right help
                  <br />
                  <span className="text-[#07863a]">for the job.</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-[475px] text-[14px] leading-[22px] text-[#69739a] sm:text-[15px] sm:leading-6">
              {isAuthenticated
                ? "Discover services and trusted providers based on your location and interests."
                : "Discover trusted professionals and businesses offering services near you."}
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
              <ServiceCategories />
            </div>
          </div>

          <HeroVisual isAuthenticated={isAuthenticated} />
        </div>
      </section>
      <ServicesListingSection isAuthenticated={isAuthenticated} />
    </main>
  );
}