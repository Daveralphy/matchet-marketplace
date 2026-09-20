// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { Link } from "react-router-dom";
import heroImage from "../assets/inspirations/homepage/hero.png";

const CATEGORIES = [
  { label: "All Categories", icon: "grid", active: true },
  { label: "Electronics", icon: "monitor" },
  { label: "Home & Living", icon: "home" },
  { label: "Fashion", icon: "bag" },
  { label: "Beauty & Personal Care", icon: "leaf" },
  { label: "Services", icon: "tools" },
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
      <>
        <path d="m14.5 6.5 3-3a4 4 0 0 0-5.3 5.3L5 16a2.1 2.1 0 1 0 3 3l7.2-7.2a4 4 0 0 0 5.3-5.3l-3 3-3-3Z" />
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

function LocationSelect() {
  return (
    <button
      type="button"
      className="flex h-12 min-w-0 flex-1 items-center gap-2 border-l border-slate-100 px-3 text-left text-[12px] font-medium text-[#10183f] sm:h-14 sm:px-4"
    >
      <Icon name="pin" size={19} />
      <span className="min-w-0 flex-1 truncate">Lagos, Nigeria</span>
      <Icon name="chevronDown" size={15} />
    </button>
  );
}

function SearchBar() {
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-2.5 rounded-2xl bg-white p-1.5 shadow-[0_10px_30px_rgba(16,24,63,0.08)] sm:flex-row sm:items-center">
      <div className="flex h-12 min-w-0 flex-1 items-center gap-2 px-3 sm:h-14">
        <Icon name="search" size={21} />
        <input
          type="search"
          placeholder="Search for products, services, or providers..."
          aria-label="Search for products, services, or providers"
          className="min-w-0 flex-1 bg-transparent text-[12px] text-[#10183f] outline-none placeholder:text-slate-400 sm:text-[13px]"
        />
      </div>

      <LocationSelect />

      <button
        type="button"
        className="h-12 shrink-0 rounded-xl bg-[#07983f] px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#068936] sm:h-14"
      >
        Search
      </button>
    </div>
  );
}

function CategoryPills() {
  return (
    <div className="flex max-w-[600px] flex-wrap gap-2.5">
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
            "flex min-h-10 items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] font-medium transition-colors",
            category.active
              ? "bg-[#dff7e7] text-[#07863a]"
              : "bg-white text-[#10183f] hover:bg-slate-50",
          ].join(" ")}
        >
          <Icon name={category.icon} size={17} />
          <span>{category.label}</span>
        </Link>
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, description, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-3.5 shadow-[0_8px_24px_rgba(16,24,63,0.06)] backdrop-blur-sm sm:px-4">
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          tone,
        ].join(" ")}
      >
        <Icon name={icon} size={21} />
      </span>

      <div className="min-w-0">
        <p className="text-[12px] font-semibold leading-4 text-[#10183f] sm:text-[13px]">
          {title}
        </p>
        <p className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-[11px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[290px] overflow-hidden sm:min-h-[390px] lg:absolute lg:inset-y-0 lg:right-0 lg:w-[55%] lg:min-h-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.86)_44%,rgba(247,250,248,0)_76%)]" />

      <img
        src={heroImage}
        alt=""
        className="absolute left-1/2 top-1/2 h-[125%] w-auto max-w-none -translate-x-[38%] -translate-y-1/2 object-contain sm:h-[130%] lg:h-[122%] lg:-translate-x-[36%]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fbfcfb] via-transparent to-transparent lg:w-[45%]" />
    </div>
  );
}

export default function Home({ isAuthenticated = false }) {
  return (
    <main className="w-full px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
      <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-[14px] border border-slate-100 bg-[#fbfcfb] shadow-[0_10px_35px_rgba(16,24,63,0.05)]">
        <div className="relative z-10 grid min-h-[620px] lg:min-h-[535px] lg:grid-cols-[48%_52%]">
          <div className="relative z-20 flex flex-col justify-center px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12 lg:px-12 lg:py-12 xl:px-[50px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#07863a] sm:text-[12px]">
              {isAuthenticated
                ? "WELCOME BACK, DAVERALPHY"
                : "A SMARTER WAY TO BUY, BOOK, AND WORK"}
            </p>

            <h1 className="mt-4 max-w-[570px] text-[40px] font-bold leading-[0.98] tracking-[-0.045em] text-[#10183f] sm:text-[50px] lg:text-[46px] xl:text-[50px]">
              {isAuthenticated ? (
                <>
                  What are you looking for{" "}
                  <span className="text-[#07863a]">today?</span>
                </>
              ) : (
                <>
                  Everything you need
                  <br />
                  in <span className="text-[#07863a]">one place.</span>
                </>
              )}
            </h1>

            <p className="mt-4 max-w-[510px] text-[15px] leading-6 text-[#69739a] sm:text-[16px]">
              Find products, book services, and connect with trusted providers
              near you.
            </p>

            <div className="mt-6">
              <SearchBar />
            </div>

            <div className="mt-4">
              <CategoryPills />
            </div>
          </div>

          <HeroVisual />

          <div className="relative z-30 hidden flex-col justify-center gap-4 px-6 lg:flex xl:px-8">
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
        </div>

        <div className="relative z-30 grid gap-3 border-t border-slate-100 bg-white/80 p-4 lg:hidden">
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
      </section>
    </main>
  );
}
