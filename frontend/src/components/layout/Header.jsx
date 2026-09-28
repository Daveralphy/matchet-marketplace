// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/matchet_logoname.png";
import mobileLogo from "../../assets/logo/matchet_logo.png";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { searchMarketplace } from "../../data/marketplaceApi";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Services", path: "/services" },
  { label: "Products", path: "/products" },
  { label: "For Providers", path: "/for-providers" },
];

const MOBILE_NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Products", path: "/products" },
  { label: "Services", path: "/services" },
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
  {
    label: "My Profile",
    description: "View and edit your profile",
    path: "/profile",
    icon: "user",
  },
  {
    label: "My Orders",
    description: "Track and manage your orders",
    path: "/orders",
    icon: "box",
  },
  {
    label: "My Bookings",
    description: "View your service bookings",
    path: "/bookings",
    icon: "calendar",
  },
  {
    label: "Saved Items",
    description: "Products and services you saved",
    path: "/saved-items",
    icon: "heart",
  },
  {
    label: "Account Settings",
    description: "Manage your account preferences",
    path: "/settings",
    icon: "settings",
  },
  {
    label: "Help & Support",
    description: "Get help or contact support",
    path: "/help",
    icon: "help",
  },
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
    heart: (
      <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1-1.8 1.8-.1-.1a1.8 1.8 0 0 0-2-.3 1.8 1.8 0 0 0-1 1.7v.2h-2.5v-.2a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2-.3l-.1.1-1.8-1.8.1-.1a1.8 1.8 0 0 0 .3-2 1.8 1.8 0 0 0-1.7-1H6v-2.5h.2a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.3-2l-.1-.1 1.8-1.8.1.1a1.8 1.8 0 0 0 2 .3 1.8 1.8 0 0 0 1-1.7V4h2.5v.2a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.3l.1-.1 1.8 1.8-.1.1a1.8 1.8 0 0 0-.3 2 1.8 1.8 0 0 0 1.7 1h.2v2.5h-.2a1.8 1.8 0 0 0-1.7 1Z" />
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

function Logo({ src = logo, mobile = false }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt="Matchet"
        className={
          mobile
            ? "h-5 w-auto object-contain"
            : "h-9 w-auto object-contain"
        }
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={
        mobile
          ? "text-[14px] font-semibold tracking-[-0.06em] text-[#10183f]"
          : "text-[25px] font-semibold tracking-[-0.06em] text-[#10183f]"
      }
    >
      {mobile ? "M" : "matchet"}
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
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount: liveCartCount } = useCart();
  const { logout: authLogout, notifications: authNotifications, markNotificationsRead } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState(() => window.localStorage.getItem("matchet_location") || initialLocation);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutSubmitting, setLogoutSubmitting] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const locationRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const cartActive = location.pathname === "/cart";

  const closeOverlays = () => {
    setLocationOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const persistLocation = (value) => {
    setSelectedLocation(value);
    window.localStorage.setItem("matchet_location", value);
  };

  useEffect(() => {
    let active = true;
    const query = searchValue.trim();
    if (!query) {
      setSearchSuggestions([]);
      return undefined;
    }
    const timer = window.setTimeout(async () => {
      const results = await searchMarketplace({ query, location: selectedLocation });
      if (active) setSearchSuggestions(results.slice(0, 6));
    }, 120);
    return () => { active = false; window.clearTimeout(timer); };
  }, [searchValue, selectedLocation]);

  const submitSearch = () => {
    const query = searchValue.trim();
    if (!query) return;
    navigate(`/explore?q=${encodeURIComponent(query)}&location=${encodeURIComponent(selectedLocation)}`);
    closeOverlays();
    setSearchSuggestions([]);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        locationOpen &&
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setLocationOpen(false);
      }

      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [locationOpen, profileOpen, mobileMenuOpen]);

  return (
    <header className="relative z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[68px] w-full max-w-[1470px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 shadow-[0_8px_24px_rgba(16,24,63,0.06)] lg:px-6">
        <Link
          to="/"
          aria-label="Matchet home"
          className="flex shrink-0 items-center min-[1160px]:hidden"
          onClick={closeOverlays}
        >
          <Logo src={mobileLogo} mobile />
        </Link>

        <Link
          to="/"
          aria-label="Matchet home"
          className="hidden shrink-0 items-center min-[1160px]:flex"
          onClick={closeOverlays}
        >
          <Logo />
        </Link>

        <nav
          className="hidden min-w-0 items-center justify-start gap-3 pl-7 min-[1160px]:flex min-[1160px]:gap-[clamp(0.75rem,1.4vw,1.25rem)]"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeOverlays}
              className={[
                "relative whitespace-nowrap py-6 text-[clamp(12px,1.05vw,14px)] font-medium text-[#24305f] transition-colors",
                isActive(item.path)
                  ? "text-[#07983f]"
                  : "hover:text-[#07983f]",
              ].join(" ")}
            >
              {item.label}

              {isActive(item.path) && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#07983f]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="col-span-2 flex min-w-0 items-center gap-1.5 min-[1160px]:col-auto min-[1160px]:hidden">
          <div className="flex min-w-0 flex-1 items-center">
            {!searchOpen ? (
              <>
                <div
                  ref={locationRef}
                  className="relative min-w-0 flex-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLocationOpen((open) => !open);
                      setProfileOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={[
                      "flex h-10 w-full min-w-0 items-center gap-1.5 rounded-lg border px-2 text-[11px] font-medium transition-colors sm:h-11 sm:px-2.5 sm:text-[12px]",
                      locationOpen
                        ? "border-[#07983f] text-[#24305f]"
                        : "border-slate-200 text-[#24305f] hover:border-slate-300",
                    ].join(" ")}
                    aria-expanded={locationOpen}
                  >
                    <Icon name="pin" size={18} />

                    <span className="min-w-0 flex-1 truncate text-left">
                      {selectedLocation}
                    </span>

                    <Icon
                      name={locationOpen ? "chevronUp" : "chevronDown"}
                      size={15}
                    />
                  </button>

                  {locationOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[246px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_14px_30px_rgba(16,24,63,0.12)]">
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
                            persistLocation(option);
                            setLocationOpen(false);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] text-[#24305f] hover:bg-slate-50",
                            option === selectedLocation
                              ? "bg-[#effaf3]"
                              : "",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2">
                            <Icon name="pin" size={15} />
                            {option}
                          </span>

                          {option === selectedLocation && (
                            <span className="font-semibold text-[#07983f]">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true);
                    setLocationOpen(false);
                    setProfileOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-[#071449] hover:text-[#07983f] sm:h-11 sm:w-11"
                  aria-label="Open search"
                >
                  <Icon name="search" size={23} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchValue("");
                    setLocationOpen(false);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-[#071449] hover:text-[#07983f] sm:h-11 sm:w-11"
                  aria-label="Show location"
                >
                  <Icon name="pin" size={21} />
                </button>

                <div className="relative flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2.5 sm:h-11 sm:px-3">
                  <Icon name="search" size={19} />

                  <input
                    autoFocus
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitSearch();
                    }}
                    placeholder="Search..."
                    className="min-w-0 flex-1 bg-transparent text-[11px] text-[#24305f] outline-none placeholder:text-slate-400 sm:text-[12px]"
                    aria-label="Search Matchet"
                  />

                  <button type="button" onClick={() => { setSearchValue(""); setSearchOpen(false); }} className="shrink-0 text-[#24305f] hover:text-[#07983f]" aria-label="Close search">
                    <Icon name="x" size={17} />
                  </button>

                  {searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[90] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_16px_40px_rgba(16,24,63,0.14)]">
                      {searchSuggestions.map((item) => (
                        <button key={item.id} type="button" onClick={() => navigate(`/${item.type === "service" ? "services" : "products"}/${item.id}`)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50">
                          <span className="h-9 w-9 shrink-0 rounded-lg bg-slate-100" />
                          <span className="min-w-0">
                            <span className="block truncate text-[12px] font-semibold text-[#071449]">{item.title}</span>
                            <span className="block truncate text-[10px] text-slate-400">{item.category} · {item.location}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <Link
            to="/cart"
            onClick={closeOverlays}
            aria-label="Cart"
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-50 sm:h-11 sm:w-11 ${cartActive ? "text-[#07983f]" : "text-[#071449]"}`}
          >
            <Icon name="cart" size={22} />
            {liveCartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#07983f] px-0.5 text-[9px] font-semibold text-white">{liveCartCount}</span>
            )}
          </Link>

          <div ref={mobileMenuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setLocationOpen(false);
                setProfileOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#071449] transition-colors hover:bg-slate-50 hover:text-[#07983f] sm:h-11 sm:w-11"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} size={23} />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-max min-w-[185px] rounded-xl border border-slate-100 bg-white p-3 shadow-[0_14px_35px_rgba(16,24,63,0.13)]">
                <nav className="space-y-1" aria-label="Mobile navigation">
                  {[
                    ...MOBILE_NAV_ITEMS,
                    ...(isAuthenticated
                      ? PROFILE_ITEMS.slice(0, 5)
                      : [
                          { label: "Sign in", path: "/login" },
                          {
                            label: "Create account",
                            path: "/create-account",
                          },
                        ]),
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeOverlays}
                      className={[
                        "flex items-center whitespace-nowrap rounded-lg px-4 py-3 text-[14px] font-medium text-[#24305f]",
                        isActive(item.path)
                          ? "bg-[#effaf3] text-[#07983f]"
                          : "hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={async () => {
                        closeOverlays();
                        setLogoutConfirmOpen(true);
                      }}
                      className="mt-1 flex w-full items-center rounded-lg px-4 py-3 text-left text-[14px] font-medium text-red-500 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 min-[1160px]:flex min-[1160px]:gap-2.5">
          <div className="hidden h-11 min-w-0 w-[199px] items-center min-[1160px]:flex">
            {!searchOpen ? (
              <>
                <div
                  ref={locationRef}
                  className="relative min-w-0 flex-1 max-w-[155px]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLocationOpen((open) => !open);
                      setProfileOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className={[
                      "flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border px-2.5 text-[clamp(11px,0.9vw,13px)] font-medium transition-colors",
                      locationOpen
                        ? "border-[#07983f] text-[#24305f]"
                        : "border-slate-200 text-[#24305f] hover:border-slate-300",
                    ].join(" ")}
                    aria-expanded={locationOpen}
                  >
                    <Icon name="pin" size={19} />

                    <span className="min-w-0 flex-1 truncate text-left">
                      {selectedLocation}
                    </span>

                    <Icon
                      name={locationOpen ? "chevronUp" : "chevronDown"}
                      size={16}
                    />
                  </button>

                  {locationOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[246px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-[0_14px_30px_rgba(16,24,63,0.12)]">
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
                            persistLocation(option);
                            setLocationOpen(false);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] text-[#24305f] hover:bg-slate-50",
                            option === selectedLocation
                              ? "bg-[#effaf3]"
                              : "",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2">
                            <Icon name="pin" size={15} />
                            {option}
                          </span>

                          {option === selectedLocation && (
                            <span className="font-semibold text-[#07983f]">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true);
                    setLocationOpen(false);
                    setProfileOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-[#071449] hover:text-[#07983f]"
                  aria-label="Open search"
                >
                  <Icon name="search" size={24} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchValue("");
                    setLocationOpen(false);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-[#071449] hover:text-[#07983f]"
                  aria-label="Show location"
                >
                  <Icon name="pin" size={21} />
                </button>

                <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
                  <Icon name="search" size={20} />

                  <input
                    autoFocus
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitSearch();
                    }}
                    placeholder="Search..."
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-[#24305f] outline-none placeholder:text-slate-400"
                    aria-label="Search Matchet"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue("");
                      setSearchOpen(false);
                    }}
                    className="shrink-0 text-[#24305f] hover:text-[#07983f]"
                    aria-label="Close search"
                  >
                    <Icon name="x" size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="hidden h-8 w-px bg-slate-200 min-[1160px]:block" />

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

            {liveCartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#07983f] px-1 text-[10px] font-semibold text-white">
                {liveCartCount}
              </span>
            )}

            {cartActive && (
              <span className="absolute -bottom-3 left-0 right-0 mx-auto h-[2px] w-5 rounded-full bg-[#07983f]" />
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="relative hidden min-[1160px]:block">
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((open) => !open);
                    setProfileOpen(false);
                    setLocationOpen(false);
                  }}
                  className="relative text-[#071449] transition-colors hover:text-[#07983f]"
                >
                  <Icon name="bell" size={24} />
                  {authNotifications.some((item) => !item.read) && (
                    <span className="absolute -right-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#07983f]" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+14px)] z-[80] w-[330px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_16px_40px_rgba(16,24,63,0.15)]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <div>
                        <p className="text-[14px] font-semibold text-[#071449]">Notifications</p>
                        <p className="text-[11px] text-slate-400">Recent account activity</p>
                      </div>
                      {authNotifications.some((item) => !item.read) && (
                        <button type="button" onClick={markNotificationsRead} className="text-[11px] font-semibold text-[#07983f] hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {authNotifications.length ? authNotifications.map((item) => (
                        <button key={item.id} type="button" onClick={markNotificationsRead} className="flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50">
                          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.type === "login" ? "bg-[#eaf2ff] text-[#2866d6]" : "bg-[#e4f9e9] text-[#07983f]"}`}>
                            <Icon name={item.type === "login" ? "user" : "bell"} size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold text-[#071449]">{item.title}</span>
                            <span className="mt-0.5 block text-[11px] leading-5 text-slate-400">{item.message}</span>
                          </span>
                        </button>
                      )) : (
                        <div className="px-4 py-10 text-center text-[12px] text-slate-400">No notifications yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-8 w-px bg-slate-200 min-[1160px]:block" />

              <button
                ref={profileRef}
                type="button"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setLocationOpen(false);
                  setMobileMenuOpen(false);
                  setNotificationsOpen(false);
                }}
                className="relative hidden items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 min-[1160px]:flex"
                aria-expanded={profileOpen}
                aria-label="Open account menu"
              >
                <span className="relative flex h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
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

                <Icon
                  name={profileOpen ? "chevronUp" : "chevronDown"}
                  size={16}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-6 top-[calc(100%-2px)] w-[290px] overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-[0_14px_35px_rgba(16,24,63,0.13)]">
                  <div className="space-y-1">
                    {PROFILE_ITEMS.map((item, index) => (
                      <div key={item.path}>
                        {index === 4 && (
                          <div className="my-2 h-px bg-slate-200" />
                        )}

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
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutConfirmOpen(true);
                      }}
                      className="flex w-full items-center gap-4 rounded-lg px-2.5 py-2.5 text-left hover:bg-red-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-red-500">
                        <Icon name="logout" size={23} />
                      </span>

                      <span>
                        <span className="block text-[14px] font-medium text-red-500">
                          Log out
                        </span>

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
                className="hidden h-11 items-center rounded-lg border border-slate-200 px-5 text-[13px] font-medium text-[#071449] transition-colors hover:border-slate-300 hover:bg-slate-50 min-[1160px]:flex"
              >
                Sign in
              </Link>

              <Link
                to="/create-account"
                onClick={closeOverlays}
                className="hidden h-11 items-center rounded-lg bg-[#07983f] px-5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#068936] min-[1160px]:flex"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071449]/35 px-4 backdrop-blur-[2px]">
          <div role="dialog" aria-modal="true" aria-labelledby="logout-title" className="w-full max-w-[390px] rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(16,24,63,0.2)]">
            <h2 id="logout-title" className="text-[20px] font-semibold text-[#10183f]">Log out of Matchet?</h2>
            <p className="mt-2 text-[14px] leading-6 text-[#69739a]">You will need to sign in again to access your account.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" disabled={logoutSubmitting} onClick={() => setLogoutConfirmOpen(false)} className="flex h-11 flex-1 items-center justify-center rounded-lg border border-slate-200 text-[13px] font-semibold text-[#24305f] hover:bg-slate-50 disabled:opacity-60">Cancel</button>
              <button type="button" disabled={logoutSubmitting} onClick={async () => {
                setLogoutSubmitting(true);
                try { await authLogout(); } finally { setLogoutSubmitting(false); setLogoutConfirmOpen(false); }
              }} className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#ef4b4b] text-[13px] font-semibold text-white hover:bg-[#dc3e3e] disabled:cursor-not-allowed disabled:opacity-60">{logoutSubmitting ? "Logging out..." : "Log out"}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}