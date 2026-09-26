// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/inspirations/homepage/hero.png";
import { FEATURED_ITEMS, PICKED_ITEMS } from "../data/homeMarketplaceMock";
import { CONTINUE_ITEMS, POPULAR_NEARBY_ITEMS } from "../data/homePopularMock";
import { MATCHING_METRICS, MATCH_RECOMMENDATIONS } from "../data/homeMatchingMock";
import { COMMUNITY_REVIEW_SECTION, calculateReviewStats, formatReviewCount } from "../data/homeCommunityMock";
import { MOBILE_APP_SECTIONS } from "../data/homeMobileAppMock";
import mockup2 from "../assets/inspirations/homepage/mockup2.png";
import mockup3 from "../assets/inspirations/homepage/mockup3.png";
import appStoreBadge from "../assets/inspirations/homepage/app-store-badge.svg";
import googlePlayBadge from "../assets/inspirations/homepage/google-play-badge.svg";
import matchMockup from "../assets/inspirations/homepage/mockup1.png";

const CATEGORIES = [
  { label: "All Categories", icon: "grid", active: true },
  { label: "Electronics", icon: "monitor" },
  { label: "Home & Living", icon: "home" },
  { label: "Fashion", icon: "bag" },
  { label: "Beauty & Personal Care", icon: "leaf" },
  { label: "Services", icon: "tools" },
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

    cart: (
      <>
        <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20.5 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),

    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
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
  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex w-full gap-2.5 overflow-x-auto pb-1 pr-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
        {CATEGORIES.map((category) => (
          <Link
            key={category.label}
            to={
              category.label === "Services"
                ? "/services"
                : category.label === "Products"
                  ? "/products"
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

function FeatureCard({ icon, title, description, tone }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[15px] bg-white px-3.5 py-3 shadow-[0_8px_24px_rgba(16,24,63,0.06)]">
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
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:h-full lg:w-[58%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_48%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_42%,rgba(248,250,249,0)_76%)]" />

      <img
        src={heroImage}
        alt=""
        className="absolute left-[50%] top-1/2 h-[99%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:h-[102%]"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#fbfcfb] via-[#fbfcfb]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#fbfcfb]/70 to-transparent" />
    </div>
  );
}

function DesktopFeatureCards() {
  return (
    <div className="absolute right-[18px] top-1/2 z-30 hidden w-[180px] -translate-y-1/2 flex-col gap-4 xl:right-[20px] xl:w-[190px] lg:flex">
      <FeatureCard
        icon="cart"
        title="Shop quality products"
        description="From trusted sellers"
        tone="bg-[#e4f9e9] text-[#07983f]"
      />

      <FeatureCard
        icon="calendar"
        title="Book trusted services"
        description="For your everyday needs"
        tone="bg-[#f0e8ff] text-[#6d31db]"
      />

      <FeatureCard
        icon="users"
        title="Connect with verified providers"
        description="People you can trust"
        tone="bg-[#e5efff] text-[#2866d6]"
      />
    </div>
  );
}

function MobileFeatureCards() {
  return (
    <div className="grid gap-3 border-t border-slate-100 bg-white/80 p-4 lg:hidden">
      <FeatureCard
        icon="cart"
        title="Shop quality products"
        description="From trusted sellers"
        tone="bg-[#e4f9e9] text-[#07983f]"
      />

      <FeatureCard
        icon="calendar"
        title="Book trusted services"
        description="For your everyday needs"
        tone="bg-[#f0e8ff] text-[#6d31db]"
      />

      <FeatureCard
        icon="users"
        title="Connect with verified providers"
        description="People you can trust"
        tone="bg-[#e5efff] text-[#2866d6]"
      />
    </div>
  );
}


function HeartIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

function MarketplaceCard({ item, compact = false }) {
  return (
    <article className={`group shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[0_6px_20px_rgba(16,24,63,0.07)] ${compact ? "w-[166px]" : "w-[172px] sm:w-[180px]"}`}>
      <div
        className={[
          "relative flex items-center justify-center overflow-hidden",
          compact ? "h-[145px]" : "h-[178px]",
          item.imageTone,
        ].join(" ")}
      >
        <span className="text-[#10183f]/30 transition-transform duration-300 group-hover:scale-105">
          <Icon name={item.icon} size={72} strokeWidth={1.25} />
        </span>

        <button
          type="button"
          aria-label={`Save ${item.title}`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_10px_rgba(16,24,63,0.12)] transition-colors hover:text-[#07983f]"
        >
          <HeartIcon size={17} />
        </button>
      </div>

      <div className={compact ? "px-3 pb-3 pt-2.5" : "px-3 pb-3.5 pt-2.5"}>
        <div className="flex items-center justify-between gap-2">
          <span className={`max-w-[112px] truncate rounded-full px-2.5 py-1 text-[9px] font-medium ${item.categoryTone}`}>
            {item.category}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-[9px] font-semibold text-[#10183f]">
            <span className="text-[#f4b400]">★</span>
            {item.rating}
          </span>
        </div>

        <h3 className="mt-2.5 truncate text-[12px] font-semibold tracking-[-0.015em] text-[#10183f]">
          {item.title}
        </h3>

        <p className="mt-2 text-[14px] font-bold tracking-[-0.02em] text-[#07863a]">
          {item.price}
        </p>

        <div className="mt-3 flex min-w-0 items-center gap-2">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${item.avatarTone}`}>
            {item.sellerInitial}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-[#10183f]">
              {item.seller}
            </p>

            <p className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-[#7b84a3]">
              <Icon name="pin" size={11} />
              {item.location}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function MarketplaceSection({ eyebrow, title, accent, subtitle, items, viewPath = "/explore" }) {
  const railRef = useRef(null);

  const scrollRail = (direction) => {
    railRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 bg-[#fbfcfb] px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-7 sm:py-8 lg:mt-6 lg:px-10 lg:py-9">
      <div className="flex items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[10px]">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-[30px] font-bold leading-none tracking-[-0.045em] text-[#10183f] sm:text-[38px]">
            {title}{" "}
            <span className="text-[#07863a]">{accent}</span>
          </h2>

          <p className="mt-2 text-[12px] leading-5 text-[#69739a] sm:text-[14px]">
            {subtitle}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <Link
            to={viewPath}
            className="text-[12px] font-semibold text-[#07863a] transition-colors hover:text-[#056e2c]"
          >
            View all <span className="ml-1 text-[16px]">→</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollRail(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f8] text-[#7782a8] transition-colors hover:bg-[#e7ebf1]"
            >
              <span className="text-[20px] leading-none">‹</span>
            </button>

            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollRail(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_12px_rgba(16,24,63,0.07)] transition-colors hover:bg-[#f7f8fa]"
            >
              <span className="text-[20px] leading-none">›</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between sm:hidden">
        <Link
          to={viewPath}
          className="text-[11px] font-semibold text-[#07863a]"
        >
          View all <span className="ml-1 text-[15px]">→</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollRail(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f4f8] text-[#7782a8]"
          >
            <span className="text-[19px] leading-none">‹</span>
          </button>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollRail(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_12px_rgba(16,24,63,0.07)]"
          >
            <span className="text-[19px] leading-none">›</span>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {items.map((item) => (
          <MarketplaceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}


function NearbyMarketplaceSection({ isAuthenticated }) {
  const railRef = useRef(null);

  const items = isAuthenticated ? CONTINUE_ITEMS : POPULAR_NEARBY_ITEMS;
  const title = isAuthenticated ? "Continue" : "Popular";
  const accent = isAuthenticated ? "exploring" : "near you";
  const eyebrow = isAuthenticated ? "CONTINUE WHERE YOU LEFT OFF" : "EXPLORE LOCALLY";
  const subtitle = isAuthenticated
    ? "Pick up where you left off or discover something new."
    : "See what people are discovering, buying, and booking around Lagos.";
  const sectionTone = isAuthenticated ? "bg-[#f5fcf8]" : "bg-[#fbfcff]";

  const scrollRail = (direction) => {
    railRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`mx-auto mt-6 max-w-[1470px] rounded-[14px] border border-slate-100 ${sectionTone} px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-7 sm:py-8 lg:px-10 lg:py-9`}
    >
      <div className="flex items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[10px]">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-[30px] font-bold leading-none tracking-[-0.045em] text-[#10183f] sm:text-[38px]">
            {title}{" "}
            <span className="text-[#07863a]">{accent}</span>
          </h2>

          <p className="mt-2 text-[12px] leading-5 text-[#69739a] sm:text-[14px]">
            {subtitle}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <Link
            to="/explore"
            className="text-[12px] font-semibold text-[#07863a] transition-colors hover:text-[#056e2c]"
          >
            View all <span className="ml-1 text-[16px]">→</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollRail(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f8] text-[#7782a8] transition-colors hover:bg-[#e7ebf1]"
            >
              <span className="text-[20px] leading-none">‹</span>
            </button>

            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollRail(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_12px_rgba(16,24,63,0.07)] transition-colors hover:bg-[#f7f8fa]"
            >
              <span className="text-[20px] leading-none">›</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between sm:hidden">
        <Link to="/explore" className="text-[11px] font-semibold text-[#07863a]">
          View all <span className="ml-1 text-[15px]">→</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollRail(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f4f8] text-[#7782a8]"
          >
            <span className="text-[19px] leading-none">‹</span>
          </button>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollRail(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_12px_rgba(16,24,63,0.07)]"
          >
            <span className="text-[19px] leading-none">›</span>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {items.map((item) => (
          <MarketplaceCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}


function MatchingIcon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    chat: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.4 8.4 0 0 1-3.5-.8L4 20l1.7-4.1A7.4 7.4 0 0 1 4.5 11.5 7.5 7.5 0 1 1 20 11.5Z" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="9" cy="6" r="2" />
        <circle cx="15" cy="12" r="2" />
        <circle cx="10" cy="18" r="2" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 6.5L20 11l-6.5 1.5L12 19l-1.5-6.5L4 11l6.5-1.5L12 3Z" />
        <path d="m19 4 .5 2L21.5 6 19.5 6.5 19 8l-.5-1.5L17 6l1.5-.5L19 4Z" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 12 19 5M16 5h3v3" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    tools: <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />,
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M17 14a5 5 0 0 1 4 6" />
      </>
    ),
    heart: <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const MATCH_TONES = {
  green: {
    icon: "bg-[#e0f8e8] text-[#07863a]",
    card: "bg-white",
  },
  purple: {
    icon: "bg-[#eee5ff] text-[#6938d7]",
    card: "bg-white",
  },
  blue: {
    icon: "bg-[#e4efff] text-[#1769df]",
    card: "bg-white",
  },
  red: {
    icon: "bg-[#ffe5e7] text-[#ef4f5f]",
    card: "bg-white",
  },
};

function MatchingStep({ number, icon, title, description, tone = "green" }) {
  const colors = MATCH_TONES[tone] || MATCH_TONES.green;

  return (
    <div className="flex min-w-0 flex-1 items-center">
      <div className={`min-h-[205px] w-full rounded-[13px] ${colors.card} px-3.5 py-4 shadow-[0_5px_18px_rgba(16,24,63,0.035)] sm:px-4 sm:py-4`}>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.icon}`}>
          <MatchingIcon name={icon} size={22} />
        </div>
        <p className="mt-3 text-[10px] font-semibold text-[#07863a]">{number}</p>
        <h3 className="mt-1 text-[15px] font-bold leading-[1.12] tracking-[-0.02em] text-[#10183f] sm:text-[16px]">
          {title}
        </h3>
        <p className="mt-2 text-[12px] leading-[17px] text-[#69739a] sm:text-[13px] sm:leading-[18px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function MatchingStat({ metric }) {
  const colors = MATCH_TONES[metric.tone] || MATCH_TONES.green;

  return (
    <div className="min-w-0 flex-1 rounded-[13px] bg-white px-4 py-4 shadow-[0_5px_18px_rgba(16,24,63,0.035)] sm:px-5 sm:py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colors.icon}`}>
          <MatchingIcon name={metric.icon} size={22} />
        </div>
        <span className="text-[27px] font-bold tracking-[-0.04em] text-[#10183f]">{metric.value}</span>
      </div>
      <h3 className="mt-3 text-[15px] font-bold tracking-[-0.02em] text-[#10183f]">{metric.title}</h3>
      <p className="mt-1 text-[12px] leading-[17px] text-[#69739a] sm:text-[13px] sm:leading-[18px]">
        {metric.description}
      </p>
    </div>
  );
}

function MatchingRecommendation({ recommendation }) {
  const colors = MATCH_TONES[recommendation.tone] || MATCH_TONES.green;

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colors.icon}`}>
        <MatchingIcon name={recommendation.icon} size={18} />
      </div>
      <span className="min-w-0 flex-1 text-[11px] font-semibold leading-4 text-[#10183f]">
        {recommendation.label}
      </span>
      <span className="text-[18px] text-[#10183f]">›</span>
    </div>
  );
}

function MatchingSection({ isAuthenticated, userName }) {
  return (
    <section className="mx-auto mt-6 max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-[#f3fbf6] shadow-[0_10px_35px_rgba(16,24,63,0.04)]">
      <div className="relative grid min-h-[545px] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10 px-6 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-11 xl:px-[35px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
            {isAuthenticated ? "YOUR MATCHES, MADE EASIER" : "MATCHET MATCHING EXPERIENCE"}
          </p>

          <h2 className="mt-3 max-w-[650px] text-[34px] font-bold leading-[1.02] tracking-[-0.045em] text-[#10183f] sm:text-[43px]">
            {isAuthenticated ? (
              <>Your <span className="text-[#07863a]">next match</span></>
            ) : (
              <>Find your <span className="text-[#07863a]">right match.</span></>
            )}
          </h2>

          <p className="mt-3 max-w-[580px] text-[14px] leading-[22px] text-[#69739a] sm:text-[16px] sm:leading-[25px]">
            {isAuthenticated
              ? "We’ve learned from what you browse, save, and explore. Let us help you find your next match."
              : "Tell us what you need, and we will help you find the right products, services, or providers without making you search endlessly."}
          </p>

          {!isAuthenticated ? (
            <>
              <div className="mt-6 hidden gap-3 sm:flex">
                <MatchingStep
                  number="01"
                  icon="chat"
                  title="Tell us what you need"
                  description="Describe what you’re looking for."
                />
                <span className="mt-[88px] shrink-0 text-[25px] text-[#07863a]">→</span>
                <MatchingStep
                  number="02"
                  icon="sliders"
                  title="We understand your needs"
                  description="We consider your preferences, location, and budget."
                  tone="purple"
                />
                <span className="mt-[88px] shrink-0 text-[25px] text-[#07863a]">→</span>
                <MatchingStep
                  number="03"
                  icon="spark"
                  title="Get better matches"
                  description="See products, services and providers that actually fit."
                  tone="green"
                />
              </div>

              <div className="mt-6 grid gap-3 sm:hidden">
                <MatchingStep number="01" icon="chat" title="Tell us what you need" description="Describe what you’re looking for." />
                <MatchingStep number="02" icon="sliders" title="We understand your needs" description="We consider your preferences, location, and budget." tone="purple" />
                <MatchingStep number="03" icon="spark" title="Get better matches" description="See products, services and providers that actually fit." />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-7">
                <Link
                  to="/explore"
                  className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#07863a] px-7 text-[15px] font-semibold text-white shadow-[0_7px_18px_rgba(7,134,58,0.18)] transition-transform hover:-translate-y-0.5"
                >
                  Find my match <span className="ml-3 text-[20px]">→</span>
                </Link>
                <button type="button" className="flex items-center gap-3 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_4px_15px_rgba(16,24,63,0.06)]">▶</span>
                  <span>
                    <span className="block text-[12px] font-semibold text-[#10183f]">See how it works</span>
                    <span className="block text-[11px] text-[#69739a]">Watch a short video</span>
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {MATCHING_METRICS.map((metric) => (
                  <MatchingStat key={metric.title} metric={metric} />
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-7">
                <Link
                  to="/explore"
                  className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#07863a] px-7 text-[15px] font-semibold text-white shadow-[0_7px_18px_rgba(7,134,58,0.18)] transition-transform hover:-translate-y-0.5"
                >
                  See my matches <span className="ml-3 text-[20px]">→</span>
                </Link>
                <button type="button" className="flex items-center gap-3 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_4px_15px_rgba(16,24,63,0.06)]">▶</span>
                  <span>
                    <span className="block text-[12px] font-semibold text-[#10183f]">How matching works</span>
                    <span className="block text-[11px] text-[#69739a]">Watch a short video</span>
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative hidden min-h-[545px] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(167,236,188,0.5),transparent_55%)]" />
          <img
            src={matchMockup}
            alt="Matchet matching experience"
            className="absolute right-[-15px] top-1/2 w-[560px] max-w-none -translate-y-1/2 object-contain xl:right-[-5px] xl:w-[600px]"
          />
        </div>
      </div>

      {isAuthenticated && (
        <div className="absolute left-1/2 top-0 hidden" aria-hidden="true" />
      )}
    </section>
  );
}


function CommunityIcon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M17 14a5 5 0 0 1 4 6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.3 8.2-8 10-4.7-1.8-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    heart: <path d="M20.8 8.8c0 5.3-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const COMMUNITY_REVIEW_ANIMATION_STYLES = `
  @keyframes communityReviewEnter {
    from {
      opacity: 0;
      transform: translate3d(18px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .community-review-card {
    animation: communityReviewEnter 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .community-review-card {
      animation: none;
    }
  }
`;


const MOBILE_APP_TONES = {
  green: "bg-[#dff7e6] text-[#07863a]",
  purple: "bg-[#eee4ff] text-[#6b35d9]",
  blue: "bg-[#e2efff] text-[#1769df]",
  orange: "bg-[#fff0df] text-[#f28a18]",
};

function MobileAppBadge({ store }) {
  const badge = store === "apple" ? appStoreBadge : googlePlayBadge;
  const label = store === "apple" ? "Download on the App Store" : "Get it on Google Play";

  return (
    <img
      src={badge}
      alt={label}
      className="h-[52px] w-auto"
    />
  );
}

function MobileAppBenefit({ item, compact = false }) {
  const tone = MOBILE_APP_TONES[item.tone] || MOBILE_APP_TONES.green;

  return (
    <div className={compact ? "flex items-center gap-3" : "flex items-center gap-3"}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`}>
        <Icon name={item.icon} size={21} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-semibold leading-[16px] text-[#10183f]">{item.title}</span>
        <span className="block text-[12px] font-semibold leading-[16px] text-[#10183f]">{item.description}</span>
      </span>
    </div>
  );
}

function MobileAppSection({ isAuthenticated, userName }) {
  const content = isAuthenticated ? MOBILE_APP_SECTIONS.loggedIn : MOBILE_APP_SECTIONS.loggedOut;
  const mockup = isAuthenticated ? mockup3 : mockup2;

  return (
    <section className={`mx-auto mt-6 max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 shadow-[0_10px_35px_rgba(16,24,63,0.04)] ${isAuthenticated ? "bg-[#f8fbff]" : "bg-[#f1fbf4]"}`}>
      <div className="relative min-h-[560px] lg:min-h-[535px]">
        <div className="relative z-10 flex min-h-[560px] w-full flex-col justify-center px-7 py-10 sm:px-10 lg:min-h-[535px] lg:w-[52%] lg:px-10 xl:px-[40px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
            {content.eyebrow}
          </p>

          <h2 className="mt-4 max-w-[590px] text-[38px] font-bold leading-[0.98] tracking-[-0.045em] text-[#10183f] sm:text-[48px]">
            {content.title}{" "}
            <span className="text-[#07863a]">{content.accent}</span>
          </h2>

          <p className="mt-4 max-w-[560px] text-[14px] leading-[22px] text-[#69739a] sm:text-[16px] sm:leading-[25px]">
            {content.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/explore"
                className="inline-flex h-[52px] items-center justify-center rounded-[10px] bg-[#07863a] px-7 text-[14px] font-semibold text-white shadow-[0_7px_18px_rgba(7,134,58,0.18)]"
              >
                {content.primaryCta} <span className="ml-2 text-[19px]">→</span>
              </Link>
            )}

            <Link to="/explore" aria-label="Download Matchet from the App Store">
              <MobileAppBadge store="apple" />
            </Link>
            <Link to="/explore" aria-label="Download Matchet from Google Play">
              <MobileAppBadge store="google" />
            </Link>
          </div>

          <div className={`mt-8 grid gap-6 ${isAuthenticated ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
            {content.benefits.map((item) => (
              <MobileAppBenefit key={item.title + item.description} item={item} />
            ))}
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_50%,rgba(170,235,188,0.52),transparent_55%)]" />
          <img
            src={mockup}
            alt=""
            className="absolute right-[-35px] top-1/2 w-[650px] max-w-none -translate-y-1/2 object-contain xl:right-[-15px] xl:w-[690px]"
          />

          <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
            {content.sideBenefits.map((item) => {
              const tone = MOBILE_APP_TONES[item.tone] || MOBILE_APP_TONES.green;
              return (
                <div key={item.title + item.description} className={`flex min-h-[62px] w-[142px] items-center gap-3 rounded-[11px] px-3 shadow-[0_5px_15px_rgba(16,24,63,0.03)] ${tone.replace("text-[#07863a]", "text-[#10183f]")}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span className="text-[11px] font-semibold leading-4 text-[#10183f]">
                    {item.title}<br />{item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityAvatar({ review, compact = false }) {
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[5px] border-white shadow-[0_4px_16px_rgba(16,24,63,0.08)]",
        compact ? "h-9 w-9 border-2" : "h-[118px] w-[118px] sm:h-[145px] sm:w-[145px]",
        review.avatarTone,
      ].join(" ")}
    >
      {review.avatarUrl ? (
        <img
          src={review.avatarUrl}
          alt={review.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={[
            "font-bold tracking-[-0.04em] text-[#10183f]",
            compact ? "text-[8px]" : "text-[28px] sm:text-[34px]",
          ].join(" ")}
        >
          {review.initials}
        </span>
      )}
    </div>
  );
}

function ReviewStars({ rating, size = "normal" }) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const starClass = size === "small" ? "text-[17px]" : "text-[22px]";

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${numericRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, numericRating - index));

        return (
          <span
            key={index}
            className={`relative inline-block leading-none ${starClass} text-[#dfe4ee]`}
            aria-hidden="true"
          >
            ★
            <span
              className="absolute inset-0 overflow-hidden text-[#f5b900]"
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
}

function CommunityReviewCard({ review, animationKey }) {
  return (
    <article
      key={animationKey}
      className="community-review-card flex min-h-[320px] items-center gap-7 rounded-[14px] border border-slate-100 bg-white px-6 py-7 shadow-[0_5px_18px_rgba(16,24,63,0.025)] sm:px-7 lg:px-8"
    >
      <CommunityAvatar review={review} />
      <div className="min-w-0">
        <blockquote className="max-w-[640px] text-[17px] font-medium leading-[1.38] tracking-[-0.02em] text-[#10183f] sm:text-[20px] lg:text-[22px]">
          “{review.quote}”
        </blockquote>

        <div className="mt-6">
          <ReviewStars rating={review.rating} />
          <p className="mt-3 text-[14px] font-bold text-[#10183f]">{review.name}</p>
          <p className="mt-1 text-[13px] text-[#69739a]">{review.role} · {review.location}</p>
        </div>
      </div>
    </article>
  );
}

function CommunityStats({ reviews }) {
  const { averageRating, reviewCount } = calculateReviewStats(reviews);
  const reviewerAvatars = reviews.slice(0, 3);

  return (
    <aside className="rounded-[14px] bg-[#eaf9ef] px-6 py-6">
      <div>
        <p className="text-[38px] font-bold leading-none tracking-[-0.045em] text-[#10183f]">
          {averageRating.toFixed(1)} / 5
        </p>
        <p className="mt-1 text-[12px] text-[#69739a]">Average community rating</p>
        <ReviewStars rating={averageRating} />
        <p className="mt-1 text-[11px] text-[#69739a]">
          Based on {formatReviewCount(reviewCount)} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="my-4 h-px bg-[#cfe8d6]" />

      <div>
        <p className="text-[38px] font-bold leading-none tracking-[-0.045em] text-[#10183f]">
          {formatReviewCount(reviewCount)}
        </p>
        <p className="mt-1 text-[12px] text-[#69739a]">Reviews from buyers and providers</p>
      </div>

      <div className="my-4 flex items-center gap-2">
        {reviewerAvatars.map((review) => (
          <CommunityAvatar key={review.id} review={review} compact />
        ))}
        {reviewCount > reviewerAvatars.length && (
          <span className="flex h-9 items-center rounded-full bg-[#d8f3df] px-3 text-[10px] font-bold text-[#07863a]">
            +{formatReviewCount(reviewCount - reviewerAvatars.length)}
          </span>
        )}
      </div>

      <p className="text-[11px] text-[#69739a]">A growing community you can trust</p>
    </aside>
  );
}

function CommunityPoints({ points }) {
  return (
    <aside className="overflow-hidden rounded-[14px] bg-[#eaf9ef]">
      {points.map((point) => (
        <div key={point.title} className="flex items-center gap-3 border-b border-[#d7eee0] px-4 py-3 last:border-b-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d5f3dd] text-[#07863a]">
            <CommunityIcon name={point.icon} size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#10183f]">{point.title}</p>
            <p className="mt-0.5 text-[10px] text-[#69739a]">{point.description}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}

function CommunitySection({ isAuthenticated }) {
  const content = isAuthenticated
    ? COMMUNITY_REVIEW_SECTION.loggedIn
    : COMMUNITY_REVIEW_SECTION.loggedOut;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const review = content.reviews[activeIndex];

  useEffect(() => {
    if (content.reviews.length <= 1 || isReviewPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % content.reviews.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [content.reviews.length, isReviewPaused]);

  const selectReview = (index) => {
    setActiveIndex(index);
  };

  const moveReview = (direction) => {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return content.reviews.length - 1;
      if (next >= content.reviews.length) return 0;
      return next;
    });
  };

  return (
    <>
      <style>{COMMUNITY_REVIEW_ANIMATION_STYLES}</style>
      <section
      className={[
        "mx-auto mt-6 max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 px-5 py-7 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-7 sm:py-8 lg:px-8 lg:py-9",
        isAuthenticated ? "bg-[#f3fbf6]" : "bg-[#fbfcff]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
            {content.eyebrow}
          </p>

          <h2 className="mt-3 text-[32px] font-bold leading-[1.02] tracking-[-0.045em] text-[#10183f] sm:text-[43px]">
            {content.title}{" "}
            <span className="text-[#07863a]">{content.accent}</span>
          </h2>

          <p className="mt-2 text-[14px] leading-6 text-[#69739a] sm:text-[16px]">
            {content.subtitle}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {isAuthenticated && (
            <span className="mr-2 text-[12px] font-medium text-[#69739a]">
              {String(activeIndex + 1).padStart(2, "0")}/{String(content.reviews.length).padStart(2, "0")}
            </span>
          )}

          <button
            type="button"
            aria-label="Previous review"
            onClick={() => moveReview(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f4f8] text-[#7782a8] transition-colors hover:bg-[#e8edf3]"
          >
            <span className="text-[22px] leading-none">‹</span>
          </button>

          <button
            type="button"
            aria-label="Next review"
            onClick={() => moveReview(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#10183f] shadow-[0_3px_12px_rgba(16,24,63,0.07)] transition-colors hover:bg-[#f7f8fa]"
          >
            <span className="text-[22px] leading-none">›</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,2.15fr)_minmax(270px,0.9fr)]">
        <div
          className="min-w-0"
          onMouseEnter={() => setIsReviewPaused(true)}
          onMouseLeave={() => setIsReviewPaused(false)}
          onFocusCapture={() => setIsReviewPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsReviewPaused(false);
            }
          }}
        >
          <CommunityReviewCard
            review={review}
            animationKey={review.id}
          />
        </div>

        {isAuthenticated ? (
          <CommunityPoints points={content.communityPoints} />
        ) : (
          <CommunityStats reviews={content.reviews} />
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {content.reviews.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show review ${index + 1}`}
              onClick={() => selectReview(index)}
              className={[
                "h-2.5 rounded-full transition-all",
                index === activeIndex ? "w-4 bg-[#07863a]" : "w-2.5 bg-[#d6dceb]",
              ].join(" ")}
            />
          ))}
        </div>

        <Link
          to="/reviews"
          className="text-[12px] font-semibold text-[#07863a] transition-colors hover:text-[#056e2c]"
        >
          {content.cta} <span className="ml-1 text-[16px]">→</span>
        </Link>
      </div>
      </section>
    </>
  );
}

export default function Home({ isAuthenticated = false, userName }) {
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
              {isAuthenticated
                ? "WELCOME BACK, DAVERALPHY"
                : "A SMARTER WAY TO BUY, BOOK, AND WORK"}
            </p>

            <h1 className="mt-4 max-w-[520px] text-[36px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[48px] lg:text-[43px] xl:text-[48px]">
              {isAuthenticated ? (
                <>
                  What are you looking
                  <br />
                  for <span className="text-[#07863a]">today?</span>
                </>
              ) : (
                <>
                  Everything you need
                  <br />
                  in <span className="text-[#07863a]">one place.</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-[475px] text-[14px] leading-[22px] text-[#69739a] sm:text-[15px] sm:leading-6">
              {isAuthenticated
                ? "Find products, book services, and connect with trusted providers near you."
                : "Discover products, book services, and connect with trusted providers near you."}
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

          <HeroVisual />

          <DesktopFeatureCards />
        </div>

        <MobileFeatureCards />
      </section>

      <MarketplaceSection
        eyebrow="FEATURED ON MATCHET"
        title="Featured on"
        accent="Matchet"
        subtitle="Popular products and services from trusted providers."
        items={FEATURED_ITEMS}
      />

      <MarketplaceSection
        eyebrow="PICKED FOR YOU"
        title="Picked"
        accent="for you"
        subtitle="Matches based on what you browse, save, and buy."
        items={PICKED_ITEMS}
      />
      <NearbyMarketplaceSection isAuthenticated={isAuthenticated} />
      <MatchingSection isAuthenticated={isAuthenticated} userName={userName} />
      <CommunitySection isAuthenticated={isAuthenticated} />
      <MobileAppSection isAuthenticated={isAuthenticated} userName={userName} />
    </main>
  );
}