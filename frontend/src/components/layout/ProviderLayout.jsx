import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/matchet_logoname.png";
import "../../styles/provider-portal.css";

const nav = [
  ["Dashboard","/provider/dashboard","home"],
  ["Bookings","/bookings","calendar"],
  ["Messages","/messages","message"],
  ["Services","/provider/services","grid"],
  ["Earnings","/earnings","wallet"],
  ["Reviews","/reviews","star"],
  ["Profile","/profile","user"],
  ["Settings","/settings","settings"],
];

function Icon({ name, size=22 }) {
  const p = {
    home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></>,
    calendar:<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></>,
    message:<><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.4-.7L4 20l1.4-3.6A7.5 7.5 0 1 1 20 11.5Z"/></>,
    grid:<><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    wallet:<><path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14"/><path d="M16 13h5M17 13a1 1 0 1 0 0 .01"/></>,
    star:<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></>,
    user:<><circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="m19 15 1.4 1.4-3 3L16 18a7.8 7.8 0 0 1-2 .8V21h-4v-2.2a7.8 7.8 0 0 1-2-.8l-1.4 1.4-3-3L5 15a7.8 7.8 0 0 1-.8-2H2v-4h2.2A7.8 7.8 0 0 1 5 7l-1.4-1.4 3-3L8 4a7.8 7.8 0 0 1 2-.8V1h4v2.2a7.8 7.8 0 0 1 2 .8l1.4-1.4 3 3L19 7c.4.6.7 1.3.8 2H22v4h-2.2a7.8 7.8 0 0 1-.8 2Z"/></>,
    search:<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
    bell:<><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    arrow:<><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
}

export default function ProviderLayout({ children }) {
  const location=useLocation();
  const navigate=useNavigate();
  const active = (path) => location.pathname === path;
  return (
    <div className="provider-portal">
      <aside className="provider-sidebar">
        <div className="provider-sidebar-logo"><img src={logo} alt="Matchet"/></div>
        <nav className="provider-nav">
          {nav.map(([label,path,icon])=>(
            <button key={path} className={active(path) ? "provider-nav-item active":"provider-nav-item"} onClick={()=>navigate(path)}>
              <Icon name={icon} size={22}/><span>{label}</span>{label==="Messages" && <b>3</b>}
            </button>
          ))}
        </nav>
        <div className="provider-sidebar-promo">
          <div className="provider-promo-icon"><Icon name="user" size={25}/></div>
          <strong>Grow your<br/>business on Matchet</strong>
          <p>Add new services, update your availability, and reach more customers.</p>
          <button>View tips <Icon name="arrow" size={17}/></button>
        </div>
      </aside>
      <div className="provider-portal-main">
        <header className="provider-topbar">
          <div className="provider-topbar-spacer"/>
          <div className="provider-search"><Icon name="search" size={21}/><span>Search bookings, messages, or help...</span></div>
          <button className="provider-bell"><Icon name="bell" size={23}/><i/></button>
          <div className="provider-account">
            <div className="provider-avatar">DE</div>
            <div><strong>Daveralphy Eferire</strong><small>Provider</small></div>
            <span>⌄</span>
          </div>
        </header>
        <main className="provider-content">{children}</main>
      </div>
    </div>
  );
}
