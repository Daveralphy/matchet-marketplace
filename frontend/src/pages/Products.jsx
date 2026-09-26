// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getMarketplaceData, getProductExperience } from "../data/marketplaceApi";
import heroImageLoggedOut from "../assets/inspirations/products/hero 1.png";
import heroImageLoggedIn from "../assets/inspirations/products/hero 2.png";

const LOCATION_OPTIONS = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Port Harcourt, Nigeria",
  "Kano, Nigeria",
  "Ibadan, Nigeria",
];

const PRODUCT_CATEGORIES = [
  { label: "Electronics", icon: "laptop" },
  { label: "Fashion", icon: "hanger" },
  { label: "Home & Living", icon: "sofa" },
  { label: "Computers", icon: "monitor" },
  { label: "Automotive", icon: "car" },
  { label: "Beauty & Care", icon: "beauty" },
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

    laptop: (
      <>
        <rect x="5" y="4" width="14" height="11" rx="1.5" />
        <path d="M3 19h18M8 19l1-2h6l1 2" />
      </>
    ),

    hanger: (
      <path d="M12 5a2.5 2.5 0 1 0-2.4-3.2M12 5c0 2.2-2.3 3.1-5.1 4.8L3 12h18l-3.9-2.2C14.3 8.1 12 7.2 12 5Z" />
    ),

    sofa: (
      <>
        <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
        <path d="M4 11a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2H4Z" />
        <path d="M4 17v3M20 17v3M7 11h10" />
      </>
    ),

    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="1.5" />
        <path d="M9 21h6M12 17v4" />
      </>
    ),

    car: (
      <>
        <path d="m5 11 2-4h10l2 4" />
        <path d="M3 11h18v6H3zM6 17v2M18 17v2" />
        <circle cx="7" cy="14" r="1.2" />
        <circle cx="17" cy="14" r="1.2" />
      </>
    ),

    beauty: (
      <>
        <path d="M12 20c-4.5 0-7-3.2-7-7 0-3.4 2.1-6.1 5.1-7.2C11 4.9 12 3 12 3s1 1.9 1.9 2.8C16.9 6.9 19 9.6 19 13c0 3.8-2.5 7-7 7Z" />
        <path d="M8 13c1.3-1 2.7-1 4 0s2.7 1 4 0" />
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

    sparkle: (
      <>
        <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
        <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z" />
      </>
    ),

    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),


    heart: (
      <>
        <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
      </>
    ),

    cart: (
      <>
        <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L20 8H6" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </>
    ),

    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),

    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),

    list: (
      <>
        <path d="M8 6h12M8 12h12M8 18h12" />
        <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
      </>
    ),

    sort: (
      <>
        <path d="M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" />
      </>
    ),

    refresh: (
      <path d="M20 11a8 8 0 0 0-14.7-3.9L4 9M4 5v4h4M4 13a8 8 0 0 0 14.7 3.9L20 15m0 4v-4h-4" />
    ),


    store: (
      <path d="M4 10h16M6 10v9h12v-9M5 10l2-5h10l2 5M9 14h6" />
    ),

    package: (
      <>
        <path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" />
        <path d="m4 8 8 4 8-4M12 12v9M8 6l8 4" />
      </>
    ),

    star: (
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    ),

    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="1.7" />
        <circle cx="18" cy="19" r="1.7" />
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
          placeholder="Search for products..."
          aria-label="Search for products"
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

function ProductCategories() {
  const colors = [
    "bg-[#edf0f6] text-[#10183f]",
    "bg-[#fff0df] text-[#a45a13]",
    "bg-[#dff7e7] text-[#07863a]",
    "bg-[#e5f1ff] text-[#2470d8]",
    "bg-[#eee8ff] text-[#7437d9]",
    "bg-[#ffe8f4] text-[#d93691]",
    "bg-[#eef0f4] text-[#10183f]",
  ];

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="flex w-full gap-2.5 overflow-x-auto pb-1 pr-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
        {PRODUCT_CATEGORIES.map((category, index) => (
          <button
            key={category.label}
            type="button"
            className="flex min-h-[66px] w-[70px] shrink-0 flex-col items-center justify-start gap-1.5 rounded-[14px] text-[9px] font-medium text-[#10183f] transition-colors hover:bg-white sm:w-[76px] sm:text-[10px]"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${colors[index]}`}
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

function ProductCard({
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

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#fbfaf7] via-[#fbfaf7]/75 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#fbfaf7]/70 to-transparent" />

      {isAuthenticated ? (
        <>
          <ProductCard
            icon="sparkle"
            title="Made for you"
            description="Products selected based on your activity."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="left-[8%] top-[18%] w-[205px] xl:left-[15%] xl:w-[220px]"
          />

          <ProductCard
            icon="bag"
            title="Great finds every day"
            description=""
            tone="bg-[#e8f7f5] text-[#0b6662]"
            className="right-[5%] bottom-[17%] w-[190px] xl:right-[10%] xl:w-[205px]"
          />
        </>
      ) : (
        <>
          <ProductCard
            icon="truck"
            title="Wide selection"
            description="Everything you need in one place."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="left-[7%] bottom-[16%] w-[205px] xl:left-[12%] xl:w-[220px]"
          />

          <ProductCard
            icon="shield"
            title="Secure shopping"
            description="Your information is protected."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="right-[6%] bottom-[16%] w-[205px] xl:right-[12%] xl:w-[220px]"
          />

          <ProductCard
            icon="users"
            title="Trusted sellers"
            description="Buy from verified businesses."
            tone="bg-[#e4f9e9] text-[#07983f]"
            className="right-[3%] top-[14%] w-[200px] xl:right-[10%] xl:w-[215px]"
          />
        </>
      )}
    </div>
  );
}


function ProductImage({ product }) {
  const icon = product.icon === "bag" ? "bag" : product.icon === "home" ? "sofa" : "monitor";

  return (
    <div className={`flex h-[152px] items-center justify-center overflow-hidden rounded-[9px] ${product.imageTone || "bg-[#f1f1ef]"}`}>
      <div className="flex h-[86px] w-[86px] items-center justify-center rounded-[24px] bg-white/65 text-[#27335f] shadow-[0_8px_20px_rgba(16,24,63,0.08)]">
        <Icon name={icon} size={52} strokeWidth={1.45} />
      </div>
    </div>
  );
}

function ProductCatalogueCard({ product }) {
  const { addItem } = useCart();
  const rating = Number(product.rating) || 0;

  return (
    <Link to={`/products/${product.id}`} className="group block min-w-0 rounded-[11px] border border-[#e5e9ef] bg-white p-2.5 shadow-[0_3px_12px_rgba(16,24,63,0.025)] transition-shadow hover:shadow-[0_8px_20px_rgba(16,24,63,0.07)]">
      <div className="relative">
        <ProductImage product={product} />
        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          onClick={(event) => { event.preventDefault(); event.stopPropagation(); addItem(product); }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#07863a] shadow-[0_2px_8px_rgba(16,24,63,0.1)]"
        >
          <Icon name="cart" size={16} />
        </button>
      </div>

      <div className="px-0.5 pb-1 pt-2">
        <h3 className="truncate text-[11px] font-medium leading-4 text-[#10183f] sm:text-[12px]">
          {product.title}
        </h3>

        <p className="mt-1 text-[13px] font-bold tracking-[-0.02em] text-[#10183f] sm:text-[14px]">
          {product.price}
        </p>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[13px] text-[#f4a900]">★</span>
          <span className="text-[10px] font-medium text-[#10183f]">{rating.toFixed(1)}</span>
          {product.reviews != null && (
            <span className="text-[10px] text-[#7b84a3]">({product.reviews})</span>
          )}
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#e9f8ed] text-[#07863a]"
          >
            <Icon name="cart" size={17} />
          </button>
        </div>

        <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[9px] text-[#7b84a3]">
          {product.sellerVerified && <Icon name="shield" size={12} strokeWidth={2.2} />}
          <span className="truncate">{product.seller} · {product.location}</span>
        </div>
      </div>
    </Link>
  );
}

function FilterSection({ title, children }) {
  return (
    <section className="border-b border-[#edf0f3] py-4 first:pt-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#10183f]">{title}</h3>
        <Icon name="chevronUp" size={14} />
      </div>
      {children}
    </section>
  );
}

function CheckRow({ label, checked, onChange, icon, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-[11px] text-[#69739a]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[#cfd6df] accent-[#07863a]"
      />
      {icon && <span className="text-[#10183f]">{icon}</span>}
      <span className="min-w-0 flex-1">{label}</span>
      {count != null && <span className="text-[#7b84a3]">({count})</span>}
    </label>
  );
}

function ProductFilters({ products, filters, setFilters }) {
  const categories = [...new Set(products.map((item) => item.category))];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = products.filter((item) => item.category === category).length;
    return acc;
  }, {});

  const prices = products
    .map((item) => Number(String(item.price).replace(/[^\d]/g, "")))
    .filter(Number.isFinite);

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <aside className="hidden w-[255px] shrink-0 rounded-[12px] border border-[#e7ebf0] bg-white px-5 py-4 lg:block">
      <FilterSection title="Categories">
        <button
          type="button"
          onClick={() => setFilters((current) => ({ ...current, category: "" }))}
          className={`mb-1 flex w-full items-center justify-between rounded-[8px] px-2 py-1.5 text-left text-[11px] font-medium ${!filters.category ? "bg-[#e5f8ea] text-[#07863a]" : "text-[#69739a]"}`}
        >
          <span>All Categories</span>
          <span>({products.length})</span>
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setFilters((current) => ({ ...current, category: current.category === category ? "" : category }))}
            className={`flex w-full items-center justify-between py-1.5 text-left text-[11px] ${filters.category === category ? "font-semibold text-[#07863a]" : "text-[#69739a]"}`}
          >
            <span>{category}</span>
            <span>({categoryCounts[category]})</span>
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="px-1">
          <input
            type="range"
            min={minPrice}
            max={maxPrice || 1}
            value={filters.maxPrice}
            onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Number(event.target.value) }))}
            className="w-full accent-[#07863a]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-[#69739a]">
            <span>₦{minPrice.toLocaleString("en-NG")}</span>
            <span>₦{filters.maxPrice.toLocaleString("en-NG")}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        {[4, 3, 2, 1].map((rating) => (
          <CheckRow
            key={rating}
            label={`${rating} & above`}
            checked={filters.rating === rating}
            onChange={() => setFilters((current) => ({ ...current, rating: current.rating === rating ? 0 : rating }))}
            icon={<span className="text-[#f4a900]">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>}
          />
        ))}
      </FilterSection>

      <FilterSection title="Condition">
        {["New", "Used"].map((condition) => (
          <CheckRow
            key={condition}
            label={condition}
            checked={filters.condition === condition}
            onChange={() => setFilters((current) => ({ ...current, condition: current.condition === condition ? "" : condition }))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Availability">
        {["In stock", "Fast delivery"].map((availability) => (
          <CheckRow
            key={availability}
            label={availability}
            checked={filters.availability === availability}
            onChange={() => setFilters((current) => ({ ...current, availability: current.availability === availability ? "" : availability }))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Seller Type">
        {["Verified sellers", "Businesses", "Individuals"].map((sellerType) => (
          <CheckRow
            key={sellerType}
            label={sellerType}
            checked={filters.sellerType === sellerType}
            onChange={() => setFilters((current) => ({ ...current, sellerType: current.sellerType === sellerType ? "" : sellerType }))}
          />
        ))}
      </FilterSection>

      <button
        type="button"
        onClick={() => setFilters({ category: "", maxPrice, rating: 0, condition: "", availability: "", sellerType: "" })}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#cfd7e2] text-[11px] font-medium text-[#27335f]"
      >
        <Icon name="refresh" size={14} />
        Clear filters
      </button>
    </aside>
  );
}

function ProductCatalogue({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("recommended");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    maxPrice: 0,
    rating: 0,
    condition: "",
    availability: "",
    sellerType: "",
  });

  useEffect(() => {
    let active = true;

    getMarketplaceData().then((data) => {
      if (!active) return;
      setProducts(data.products);
      setLocation(data.products[0]?.location || "");
      const prices = data.products
        .map((item) => Number(String(item.price).replace(/[^\d]/g, "")))
        .filter(Number.isFinite);
      setFilters((current) => ({
        ...current,
        maxPrice: prices.length ? Math.max(...prices) : 0,
      }));
    });

    return () => { active = false; };
  }, []);

  const filtered = products.filter((product) => {
    const price = Number(String(product.price).replace(/[^\d]/g, ""));
    const rating = Number(product.rating) || 0;

    return (
      (!filters.category || product.category === filters.category) &&
      (!filters.maxPrice || price <= filters.maxPrice) &&
      (!filters.rating || rating >= filters.rating) &&
      (!filters.condition || product.condition === filters.condition) &&
      (!filters.availability || product.availability === filters.availability) &&
      (!filters.sellerType || (filters.sellerType === "Verified sellers" ? product.sellerVerified : product.sellerType === filters.sellerType))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low") return Number(String(a.price).replace(/[^\d]/g, "")) - Number(String(b.price).replace(/[^\d]/g, ""));
    if (sort === "price-high") return Number(String(b.price).replace(/[^\d]/g, "")) - Number(String(a.price).replace(/[^\d]/g, ""));
    if (sort === "rating") return Number(b.rating) - Number(a.rating);
    return Number(b.rating) - Number(a.rating);
  });

  return (
    <section className="mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-[#edf0f3] bg-[#fbfcfd] p-4 shadow-[0_8px_28px_rgba(16,24,63,0.035)] sm:p-5 lg:p-6">
      <div className="flex gap-5">
        <ProductFilters products={products} filters={filters} setFilters={setFilters} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 border-b border-[#edf0f3] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#07863a]">
                {isAuthenticated ? "PRODUCTS FOR YOU" : "EXPLORE PRODUCTS"}
              </p>
              <h2 className="mt-2 text-[38px] font-bold leading-[0.98] tracking-[-0.045em] text-[#10183f] sm:text-[48px]">
                {isAuthenticated ? (
                  <>Find products <span className="text-[#07863a]">you’ll love.</span></>
                ) : (
                  <>Discover <span className="text-[#07863a]">great products.</span></>
                )}
              </h2>
              <p className="mt-2 text-[14px] font-medium text-[#69739a]">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} found{location ? ` in ${location}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 rounded-[9px] border border-[#dfe5ec] bg-white px-3 text-[11px] font-medium text-[#27335f] outline-none"
                aria-label="Sort products"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>

              <button type="button" onClick={() => setView("grid")} className={`flex h-11 w-11 items-center justify-center rounded-[9px] border ${view === "grid" ? "border-[#dcefe2] bg-[#e8f8ed] text-[#07863a]" : "border-[#dfe5ec] bg-white text-[#69739a]"}`}>
                <Icon name="grid" size={18} />
              </button>
              <button type="button" onClick={() => setView("list")} className={`flex h-11 w-11 items-center justify-center rounded-[9px] border ${view === "list" ? "border-[#dcefe2] bg-[#e8f8ed] text-[#07863a]" : "border-[#dfe5ec] bg-white text-[#69739a]"}`}>
                <Icon name="list" size={18} />
              </button>
            </div>
          </div>

          <div className={`mt-4 grid gap-3 ${view === "grid" ? "grid-cols-2 xl:grid-cols-5" : "grid-cols-1"}`}>
            {sorted.map((product) => <ProductCatalogueCard key={product.id} product={product} />)}
          </div>

          {!sorted.length && (
            <div className="flex min-h-[260px] items-center justify-center rounded-[12px] border border-dashed border-[#d9dfe7] bg-white text-[13px] text-[#69739a]">
              No products match your selected filters.
            </div>
          )}

          <button
            type="button"
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#dfe5ec] bg-white text-[12px] font-semibold text-[#10183f]"
          >
            View more products
            <Icon name="chevronDown" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}



function ShoppingJourneySection({ isAuthenticated }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    getProductExperience().then((result) => {
      if (active) setData(result);
    });
    return () => { active = false; };
  }, []);

  if (!data) return null;

  const content = isAuthenticated ? data.loggedIn : data.loggedOut;

  return (
    <section className="mx-auto mt-5 max-w-[1470px] rounded-[14px] border border-slate-100 bg-white px-5 py-9 shadow-[0_10px_35px_rgba(16,24,63,0.04)] sm:px-9 sm:py-10 lg:px-14 lg:py-11">
      <div className="max-w-[900px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#07863a] sm:text-[11px]">
          {content.eyebrow}
        </p>
        <h2 className="mt-4 text-[42px] font-bold leading-[0.98] tracking-[-0.05em] text-[#10183f] sm:text-[54px] lg:text-[62px]">
          {content.title} <span className="text-[#07863a]">{content.accent}</span>
        </h2>
        <p className="mt-4 max-w-[720px] text-[16px] leading-[1.4] text-[#7a82a5] sm:text-[19px]">
          {content.subtitle}
        </p>
      </div>

      <div className="mt-12 hidden items-start lg:grid lg:grid-cols-5">
        {content.steps.map((step, index) => (
          <div key={step.id} className="relative px-2 text-center">
            {index < content.steps.length - 1 && (
              <div className="absolute left-[calc(50%+68px)] right-[-calc(50%-68px)] top-[31px] flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dotted border-[#8a8db3]" />
                <span className="absolute right-0 translate-x-1/2 text-[22px] leading-none text-[#72779f]">›</span>
              </div>
            )}

            <div className="relative mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#e4f8eb] text-[#07863a]">
              <Icon name={step.icon} size={46} strokeWidth={1.8} />
              <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f8eb] text-[18px] font-semibold text-[#087d35]">
                {step.number}
              </span>
            </div>

            <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.03em] text-[#10183f]">
              {step.title}
            </h3>
            <p className="mx-auto mt-2 max-w-[220px] text-[14px] leading-[1.45] text-[#7a82a5]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:hidden">
        {content.steps.map((step) => (
          <div key={step.id} className="flex items-start gap-4 rounded-[12px] border border-[#edf0f3] p-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e4f8eb] text-[#07863a]">
              <Icon name={step.icon} size={31} strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#e5f8eb] text-[11px] font-semibold text-[#087d35]">
                {step.number}
              </span>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-[#10183f]">{step.title}</h3>
              <p className="mt-1 text-[12px] leading-5 text-[#7a82a5]">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Products({ isAuthenticated = false }) {
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
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-[#fbfaf7] shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="relative min-h-0 lg:min-h-[535px]">
          <div className="relative z-20 flex w-full flex-col justify-center px-6 pb-0 pt-10 sm:px-10 sm:pt-12 lg:min-h-[535px] lg:w-[51%] lg:px-12 lg:pb-12 lg:pt-12 xl:px-[50px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#07863a] sm:text-[11px]">
              {isAuthenticated ? "PRODUCTS FOR YOU" : "PRODUCTS ON MATCHET"}
            </p>

            <h1 className="mt-4 max-w-[520px] text-[36px] font-bold leading-[0.99] tracking-[-0.045em] text-[#10183f] sm:text-[48px] lg:text-[43px] xl:text-[48px]">
              {isAuthenticated ? (
                <>
                  Find something
                  <br />
                  <span className="text-[#07863a]">
                    you’ll love.
                  </span>
                </>
              ) : (
                <>
                  Find products
                  <br />
                  <span className="text-[#07863a]">
                    worth buying.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-[475px] text-[14px] leading-[22px] text-[#69739a] sm:text-[15px] sm:leading-6">
              {isAuthenticated
                ? "Discover products selected around your interests, activity, and location."
                : "Discover quality products from trusted sellers, compare your options, and shop with confidence."}
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
              <ProductCategories />
            </div>
          </div>

          <HeroVisual isAuthenticated={isAuthenticated} />
        </div>
      </section>
      <ProductCatalogue isAuthenticated={isAuthenticated} />
      <ShoppingJourneySection isAuthenticated={isAuthenticated} />
    </main>
  );
}