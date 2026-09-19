// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/matchet_logoname.png";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Services", path: "/services" },
  { label: "Products", path: "/products" },
  { label: "For Providers", path: "/for-providers" },
];

const LOCATION_OPTIONS = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Port Harcourt, Nigeria",
  "Kano, Nigeria",
  "Ibadan, Nigeria",
];

const PROFILE_ITEMS = [
  { label: "My Profile", description: "View and edit your profile", path: "/profile", icon: "user" },
  { label: "My Orders", description: "Track and manage your orders", path: "/orders", icon: "box" },
  { label: "My Bookings", description: "View your service bookings", path: "/bookings", icon: "calendar" },
  { label: "Saved Items", description: "Products and services you saved", path: "/saved-items", icon: "heart" },
  { label: "Account Settings", description: "Manage your account preferences", path: "/settings", icon: "settings" },
  { label: "Help & Support", description: "Get help or contact support", path: "/help", icon: "help" },
];

function Icon({ name, size = 22, strokeWidth = 1.9 }) {
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
    cart: (
      <>
        <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20.5 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronUp: <path d="m6 15 6-6 6 6" />,
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4v10l-8 4-8-4Z" />
        <path d="m4 7 8 4 8-4" />
        <path d="M12 11v10" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1-1.8 1.8-.1-.1a1.8 1.8 0 0 0-2-.3 1.8 1.8 0 0 0-1 1.7v.2h-2.5v-.2a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .3l-.1.1-1.8-1.8.1-.1a1.8 1.8 0 0 0 .3-2 1.8 1.8 0 0 0-1.7-1H6v-2.5h.2a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.3-2l-.1-.1 1.8-1.8.1.1a1.8 1.8 0 0 0 2 .3 1.8 1.8 0 0 0 1-1.7V4h2.5v.2a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.3l.1-.1 1.8 1.8-.1.1a1.8 1.8 0 0 0-.3 2 1.8 1.8 0 0 0 1.7 1h.2v2.5h-.2a1.8 1.8 0 0 0-1.7 1Z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-.9.8-1.6 1.2-1.6 2.8" />
        <path d="M12 17h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
        <path d="m15 16 4-4-4-4" />
        <path d="M19 12H9" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Logo({ src = logo }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt="Matchet"
        className="h-10 w-auto object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="text-[25px] font-semibold tracking-[-0.06em] text-[#10183f]">
      matchet
    </span>
  );
}

export default function Header({
  isAuthenticated = false,
  username = "Daveralphy",
  avatarSrc = "",
  unreadNotifications = true,
  cartCount = 0,
  initialLocation = "Lagos, Nigeria",
}) {
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const cartActive = location.pathname === "/cart";

  const closeOverlays = () => {
    setLocationOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[68px] w-full max-w-[1180px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 shadow-[0_8px_24px_rgba(16,24,63,0.06)] lg:px-6">
        <Link
          to="/"
          aria-label="Matchet home"
          className="flex shrink-0 items-center"
          onClick={closeOverlays}
        >
          <Logo />
        </Link>

        <nav className="hidden min-w-0 items-center justify-start gap-3 pl-7 min-[1160px]:flex min-[1160px]:gap-[clamp(0.75rem,1.4vw,1.25rem)]" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeOverlays}
              className={[
                "relative whitespace-nowrap py-6 text-[clamp(12px,1.05vw,14px)] font-medium text-[#24305f] transition-colors",
                isActive(item.path) ? "text-[#07983f]" : "hover:text-[#07983f]",
              ].join(" ")}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[#07983f]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 min-[1160px]:gap-2.5">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((open) => !open);
              setLocationOpen(false);
              setProfileOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#071449] transition-colors hover:bg-slate-50 hover:text-[#07983f] min-[1160px]:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={23} />
          </button>


          {!searchOpen && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => {
                  setLocationOpen((open) => !open);
                  setProfileOpen(false);
                }}
                className={[
                  "flex h-11 max-w-[155px] items-center gap-2 rounded-lg border px-2.5 text-[clamp(11px,0.9vw,13px)] font-medium transition-colors",
                  locationOpen
                    ? "border-[#07983f] text-[#24305f]"
                    : "border-slate-200 text-[#24305f] hover:border-slate-300",
                ].join(" ")}
                aria-expanded={locationOpen}
              >
                <Icon name="pin" size={19} />
                <span>{selectedLocation}</span>
                <Icon name={locationOpen ? "chevronUp" : "chevronDown"} size={16} />
              </button>

              {locationOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[246px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_14px_30px_rgba(16,24,63,0.12)]">
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <Icon name="search" size={17} />
                    <input
                      type="text"
                      placeholder="Search for a city or state..."
                      className="w-full bg-transparent text-[12px] text-[#24305f] outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {LOCATION_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(option);
                        setLocationOpen(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] text-[#24305f] hover:bg-slate-50",
                        option === selectedLocation ? "bg-[#effaf3]" : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="pin" size={15} />
                        {option}
                      </span>
                      {option === selectedLocation && (
                        <span className="font-semibold text-[#07983f]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {searchOpen ? (
            <div className="hidden h-11 w-[300px] items-center gap-2 rounded-lg border border-slate-200 px-3 md:flex lg:w-[310px]">
              <Icon name="search" size={20} />
              <input
                autoFocus
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search for products, services, or providers..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#24305f] outline-none placeholder:text-slate-400"
                aria-label="Search Matchet"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setSearchOpen(false);
                }}
                className="text-[#24305f] hover:text-[#07983f]"
                aria-label="Close search"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setLocationOpen(false);
                setProfileOpen(false);
              }}
              className="hidden text-[#071449] hover:text-[#07983f] md:block"
              aria-label="Open search"
            >
              <Icon name="search" size={24} />
            </button>
          )}

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <Link
            to="/cart"
            onClick={closeOverlays}
            className={[
              "relative flex shrink-0 text-[#071449] transition-colors hover:text-[#07983f]",
              cartActive ? "text-[#07983f]" : "",
            ].join(" ")}
            aria-label="Cart"
          >
            <Icon name="cart" size={25} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#07983f] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
            {cartActive && <span className="absolute -bottom-3 left-0 right-0 mx-auto h-[2px] w-5 rounded-full bg-[#07983f]" />}
          </Link>

          {isAuthenticated ? (
            <>
              <button
                type="button"
                aria-label="Notifications"
                className="relative hidden text-[#071449] transition-colors hover:text-[#07983f] md:block"
              >
                <Icon name="bell" size={24} />
                {unreadNotifications && (
                  <span className="absolute -right-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#07983f]" />
                )}
              </button>
              <div className="hidden h-8 w-px bg-slate-200 md:block" />
              <div className="hidden h-8 w-px bg-slate-200 md:block" />

              <button
                type="button"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setLocationOpen(false);
                }}
                className="relative hidden items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 md:flex"
                aria-expanded={profileOpen}
                aria-label="Open account menu"
              >
                <span className="relative flex h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[#24305f]">
                      <Icon name="user" size={21} />
                    </span>
                  )}
                </span>
                {unreadNotifications && (
                  <span className="absolute left-[36px] top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#07983f]" />
                )}
                <span className="max-w-[100px] truncate text-[13px] font-semibold text-[#24305f]">
                  {username}
                </span>
                <Icon name={profileOpen ? "chevronUp" : "chevronDown"} size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-6 top-[calc(100%-2px)] w-[290px] overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-[0_14px_35px_rgba(16,24,63,0.13)]">
                  <div className="space-y-1">
                    {PROFILE_ITEMS.map((item, index) => (
                      <div key={item.path}>
                        {index === 4 && <div className="my-2 h-px bg-slate-200" />}
                        <Link
                          to={item.path}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-4 rounded-lg px-2.5 py-2.5 hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#071449]">
                            <Icon name={item.icon} size={23} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[14px] font-medium text-[#071449]">
                              {item.label}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </div>
                    ))}

                    <div className="my-2 h-px bg-slate-200" />

                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-4 rounded-lg px-2.5 py-2.5 text-left hover:bg-red-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-red-500">
                        <Icon name="logout" size={23} />
                      </span>
                      <span>
                        <span className="block text-[14px] font-medium text-red-500">Log out</span>
                        <span className="block text-[11px] text-slate-400">
                          Sign out of your account
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeOverlays}
                className="hidden h-11 items-center rounded-lg border border-slate-200 px-5 text-[13px] font-medium text-[#071449] transition-colors hover:border-slate-300 hover:bg-slate-50 sm:flex"
              >
                Sign in
              </Link>
              <Link
                to="/create-account"
                onClick={closeOverlays}
                className="hidden h-11 items-center rounded-lg bg-[#07983f] px-5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#068936] sm:flex"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
        {mobileMenuOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%-4px)] rounded-xl border border-slate-100 bg-white p-3 shadow-[0_14px_35px_rgba(16,24,63,0.13)] min-[1160px]:hidden">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeOverlays}
                  className={[
                    "flex items-center rounded-lg px-4 py-3 text-[14px] font-medium text-[#24305f]",
                    isActive(item.path) ? "bg-[#effaf3] text-[#07983f]" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

    </header>
  );
}
