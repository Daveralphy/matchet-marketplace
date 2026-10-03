import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/matchet_logoname.png";
import { Icon } from "./ProviderShell";
import "../styles/admin-dashboard.css";

const items = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "home" },
  { label: "Provider approvals", path: "/admin/providers", icon: "shield" },
  { label: "Seller approvals", path: "/admin/sellers", icon: "user" },
  { label: "Users", path: "/admin/users", icon: "user" },
  { label: "Listings", path: "/admin/listings", icon: "grid" },
  { label: "Reports", path: "/admin/reports", icon: "calendar" },
  { label: "Settings", path: "/admin/settings", icon: "settings" },
];

export default function AdminShell({ children }) {
  const { user, notifications, markNotificationsRead, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("matchet_admin_sidebar_collapsed") === "true");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => localStorage.setItem("matchet_admin_sidebar_collapsed", String(collapsed)), [collapsed]);
  useEffect(() => { setMobileOpen(false); setProfileOpen(false); setNotificationsOpen(false); }, [location.pathname]);
  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Administrator";
  const avatar = user?.avatar?.url || null;
  const initials = useMemo(() => displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), [displayName]);
  const unread = notifications.filter((item) => !item.read).length;

  const signOut = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={"admin-app" + (collapsed ? " sidebar-collapsed" : "") + (mobileOpen ? " mobile-nav-open" : "")}>
      <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside className="admin-sidebar">
        <div className="admin-brand-row">
          <Link to="/" className="admin-brand"><img src={logo} alt="Matchet" /></Link>
          <button type="button" className="admin-sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={18} />
          </button>
        </div>
        <div className="admin-workspace-label">ADMINISTRATION</div>
        <nav>
          {items.map((item) => <Link key={item.path} to={item.path} className={location.pathname === item.path ? "active" : ""} title={collapsed ? item.label : undefined}><Icon name={item.icon} /><span>{item.label}</span></Link>)}
        </nav>
        <div className="admin-sidebar-footer"><Icon name="shield" size={28} /><strong>Matchet<br />Administration</strong><p>Manage the marketplace, applications, and platform activity.</p></div>
      </aside>

      <header className="admin-topbar">
        <button type="button" className="admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><span /><span /><span /></button>
        <div className="admin-topbar-title"><strong>Administration</strong><span>Platform management workspace</span></div>
        <div className="admin-topbar-actions">
          <div className="admin-popover-wrap" ref={notificationRef}>
            <button type="button" className="admin-bell" onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }}><Icon name="bell" size={22} />{unread > 0 && <b>{unread > 9 ? "9+" : unread}</b>}</button>
            {notificationsOpen && <div className="admin-popover"><div className="admin-popover-head"><strong>Notifications</strong>{unread > 0 && <button onClick={markNotificationsRead}>Mark all as read</button>}</div>{notifications.length ? notifications.map((item) => <div className="admin-notification" key={item.id}><Icon name="bell" size={17} /><div><strong>{item.title || "Notification"}</strong><p>{item.message || ""}</p></div></div>) : <div className="admin-empty-mini">No notifications</div>}</div>}
          </div>
          <div className="admin-popover-wrap" ref={profileRef}>
            <button type="button" className="admin-account" onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }}>
              {avatar ? <img src={avatar} alt="" /> : <span>{initials}</span>}<div><strong>{displayName}</strong><small>Administrator</small></div><Icon name="chevron" size={16} />
            </button>
            {profileOpen && <div className="admin-popover admin-profile-menu"><div className="admin-profile-head">{avatar ? <img src={avatar} alt="" /> : <span>{initials}</span>}<div><strong>{displayName}</strong><small>{user?.email || ""}</small></div></div><button onClick={() => navigate("/admin/settings")}><Icon name="settings" size={17} /> Settings</button><button className="danger" onClick={signOut}><Icon name="logout" size={17} /> Sign out</button></div>}
          </div>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
