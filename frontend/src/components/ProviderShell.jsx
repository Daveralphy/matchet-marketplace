import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/matchet_logoname.png";
import "../styles/provider-dashboard.css";

const items = [
  { label: "Dashboard", path: "/provider/dashboard", icon: "home" },
  { label: "Bookings", path: "/provider/bookings", icon: "calendar" },
  { label: "Messages", path: "/provider/messages", icon: "message" },
  { label: "Services", path: "/provider/services", icon: "grid" },
  { label: "Earnings", path: "/provider/earnings", icon: "wallet" },
  { label: "Reviews", path: "/provider/reviews", icon: "star" },
  { label: "Profile", path: "/provider/profile", icon: "user" },
  { label: "Settings", path: "/provider/settings", icon: "settings" },
];

function Icon({ name, size = 22 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4-.9L4 20l1.2-3.4A7.2 7.2 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    wallet: <><path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M4 6V4h13a2 2 0 0 1 2 2" /><path d="M16 13h5" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 15.5a2 2 0 0 0 .4 2.1l.1.1-2 2-.1-.1a2 2 0 0 0-2.1-.4 2 2 0 0 0-1.2 1.8v.1h-2.8v-.1a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.4l-.1.1-2-2 .1-.1a2 2 0 0 0 .4-2.1 2 2 0 0 0-1.8-1.2H4v-2.8h.1a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.1l-.1-.1 2-2 .1.1a2 2 0 0 0 2.1.4A2 2 0 0 0 10.8 4v-.1h2.8V4a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.4l.1-.1 2 2-.1.1a2 2 0 0 0-.4 2.1 2 2 0 0 0-1.8 1.2Z" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    chevronLeft: <path d="m14 18-6-6 6-6" />,
    chevronRight: <path d="m10 18 6-6-6-6" />,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M13 4h6v16h-6" /></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function formatNotificationDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function ProviderShell({ children, mode = "provider" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, notifications, markNotificationsRead, logout } = useAuth();
  const sellerMode = mode === "seller";
  const navigationItems = sellerMode ? [
    { label: "Dashboard", path: "/seller/dashboard", icon: "home" },
    { label: "Orders", path: "/seller/orders", icon: "calendar" },
    { label: "Messages", path: "/seller/messages", icon: "message" },
    { label: "Products", path: "/seller/products", icon: "grid" },
    { label: "Earnings", path: "/seller/earnings", icon: "wallet" },
    { label: "Reviews", path: "/seller/reviews", icon: "star" },
    { label: "Profile", path: "/seller/profile", icon: "user" },
    { label: "Settings", path: "/seller/settings", icon: "settings" },
  ] : items;
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(sellerMode ? "matchet_seller_sidebar_collapsed" : "matchet_provider_sidebar_collapsed") === "true");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutSubmitting, setLogoutSubmitting] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Account";
  const avatar = user?.avatar?.url || null;
  const unreadCount = notifications.filter((item) => !item.read).length;

  const initials = useMemo(
    () => displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    [displayName],
  );

  useEffect(() => {
    localStorage.setItem(sellerMode ? "matchet_seller_sidebar_collapsed" : "matchet_provider_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const goToSearchResult = (event) => {
    if (event.key !== "Enter") return;
    const value = search.trim().toLowerCase();
    if (!value) return;
    if (value.includes("message") || value.includes("chat")) navigate(sellerMode ? "/seller/messages" : "/provider/messages");
    else if (sellerMode && value.includes("order")) navigate("/seller/orders");
    else if (value.includes("booking")) navigate("/provider/bookings");
    else if (value.includes("product")) navigate(sellerMode ? "/seller/products" : "/provider/services");
    else if (value.includes("service")) navigate("/provider/services");
    else if (value.includes("earning") || value.includes("payout")) navigate(sellerMode ? "/seller/earnings" : "/provider/earnings");
    else if (value.includes("review")) navigate(sellerMode ? "/seller/reviews" : "/provider/reviews");
    else if (value.includes("profile")) navigate(sellerMode ? "/seller/profile" : "/provider/profile");
    else if (value.includes("setting")) navigate(sellerMode ? "/seller/settings" : "/provider/settings");
  };

  const handleLogout = async () => {
    setLogoutSubmitting(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setLogoutSubmitting(false);
      setLogoutConfirmOpen(false);
    }
  };

  return (
    <div className={"provider-app" + (collapsed ? " sidebar-collapsed" : "") + (mobileOpen ? " mobile-nav-open" : "")}>
      <div className="provider-mobile-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />

      <aside className="provider-sidebar" aria-label={sellerMode ? "Seller navigation" : "Provider navigation"}>
        <div className="provider-brand-row">
          <Link to="/" className="provider-brand" aria-label="Matchet home"><img src={logo} alt="Matchet" /></Link>
          <button type="button" className="provider-sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={18} />
          </button>
        </div>

        <nav>
          {navigationItems.map((item) => (
            <Link key={item.path} to={item.path} className={location.pathname === item.path ? "active" : ""} title={collapsed ? item.label : undefined}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="provider-sidebar-promo">
          <Icon name="user" size={32} />
          <strong>Grow your<br />business on Matchet</strong>
          <p>Add products, manage your inventory, and reach more customers.</p>
          <button type="button" onClick={() => navigate(sellerMode ? "/seller/products" : "/provider/services")}>{sellerMode ? "View store tips" : "View tips"}&nbsp; →</button>
        </div>
      </aside>

      <header className="provider-topbar">
        <button type="button" className="provider-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <span /><span /><span />
        </button>

        <div className="provider-search">
          <Icon name="search" size={20} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={goToSearchResult} placeholder={sellerMode ? "Search orders, messages, or help..." : "Search bookings, messages, or help..."} aria-label="Search provider workspace" />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
        </div>

        <div className="provider-topbar-actions">
          <div className="provider-notification-wrap" ref={notificationRef}>
            <button type="button" className="provider-bell" onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }} aria-label={"Notifications" + (unreadCount ? `, ${unreadCount} unread` : "")}>
              <Icon name="bell" size={23} />
              {unreadCount > 0 && <span className="provider-bell-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {notificationsOpen && (
              <div className="provider-notification-panel">
                <div className="provider-popover-header"><div><strong>Notifications</strong><small>{unreadCount ? `${unreadCount} unread` : "All caught up"}</small></div>{unreadCount > 0 && <button type="button" onClick={markNotificationsRead}>Mark all as read</button>}</div>
                <div className="provider-notification-list">
                  {notifications.length ? notifications.map((notification) => (
                    <button key={notification.id} type="button" className={"provider-notification-item" + (!notification.read ? " unread" : "")} onClick={() => { markNotificationsRead(); setNotificationsOpen(false); }}>
                      <span className="provider-notification-icon"><Icon name={notification.type === "login" ? "shield" : "bell"} size={18} /></span>
                      <span><strong>{notification.title || "Notification"}</strong><small>{notification.message || ""}</small><time>{formatNotificationDate(notification.createdAt)}</time></span>
                    </button>
                  )) : <div className="provider-notification-empty"><Icon name="bell" size={28} /><strong>No notifications</strong><p>You are all caught up.</p></div>}
                </div>
              </div>
            )}
          </div>

          <div className="provider-account-wrap" ref={profileRef}>
            <button type="button" className="provider-account" onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }} aria-expanded={profileOpen}>
              {avatar ? <img src={avatar} alt="" /> : <div className="provider-account-fallback">{initials}</div>}
              <div><strong>{displayName}</strong><small>{sellerMode ? "Seller" : user?.role === "provider" ? "Provider" : "Account"}</small></div>
              <Icon name="chevron" size={17} />
            </button>

            {profileOpen && (
              <div className="provider-profile-menu">
                <div className="provider-profile-menu-head">
                  {avatar ? <img src={avatar} alt="" /> : <div className="provider-account-fallback">{initials}</div>}
                  <div><strong>{displayName}</strong><small>{user?.email || "Provider account"}</small></div>
                </div>
                <button type="button" onClick={() => navigate(sellerMode ? "/seller/profile" : "/provider/profile")}><Icon name="user" size={18} /> Profile</button>
                <button type="button" onClick={() => navigate(sellerMode ? "/seller/settings" : "/provider/settings")}><Icon name="settings" size={18} /> Settings</button>
                <button type="button" onClick={() => navigate(sellerMode ? "/seller/messages" : "/provider/messages")}><Icon name="message" size={18} /> Messages {unreadCount > 0 && <b>{unreadCount}</b>}</button>
                <div className="provider-profile-menu-divider" />
                <button type="button" className="danger" onClick={() => { setProfileOpen(false); setLogoutConfirmOpen(true); }}><Icon name="logout" size={18} /> Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="provider-main">{children}</main>
      {logoutConfirmOpen && (
        <div className="provider-logout-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !logoutSubmitting) setLogoutConfirmOpen(false); }}>
          <div className="provider-logout-modal" role="dialog" aria-modal="true" aria-labelledby="provider-logout-title">
            <h2 id="provider-logout-title">Log out of Matchet?</h2>
            <p>You will need to sign in again to access your account.</p>
            <div className="provider-logout-actions">
              <button type="button" disabled={logoutSubmitting} onClick={() => setLogoutConfirmOpen(false)}>Cancel</button>
              <button type="button" className="danger" disabled={logoutSubmitting} onClick={handleLogout}>{logoutSubmitting ? "Logging out..." : "Log out"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export { Icon };
