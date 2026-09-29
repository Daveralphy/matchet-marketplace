import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/matchet_logoname.png";
import providerImage from "../assets/inspirations/provider/provideronboarding.png";

const items=[
 {label:"Dashboard",path:"/provider/dashboard",icon:"home"},
 {label:"Bookings",path:"/provider/bookings",icon:"calendar"},
 {label:"Messages",path:"/provider/messages",icon:"message",badge:3},
 {label:"Services",path:"/provider/services",icon:"grid"},
 {label:"Earnings",path:"/provider/earnings",icon:"wallet"},
 {label:"Reviews",path:"/provider/reviews",icon:"star"},
 {label:"Profile",path:"/provider/profile",icon:"user"},
 {label:"Settings",path:"/provider/settings",icon:"settings"},
];

function Icon({name,size=22}){const p={home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></>,calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,message:<><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4-.9L4 20l1.2-3.4A7.2 7.2 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z"/></>,grid:<><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,wallet:<><path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M4 6V4h13a2 2 0 0 1 2 2"/><path d="M16 13h5"/></>,star:<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,user:<><circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/></>,clock:<><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></>,plus:<><path d="M12 5v14M5 12h14"/></>,settings:<><circle cx="12" cy="12" r="3"/><path d="M19 15.5a2 2 0 0 0 .4 2.1l.1.1-2 2-.1-.1a2 2 0 0 0-2.1-.4 2 2 0 0 0-1.2 1.8v.1h-2.8v-.1a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.1.4l-.1.1-2-2 .1-.1a2 2 0 0 0 .4-2.1 2 2 0 0 0-1.8-1.2H4v-2.8h.1a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.1l-.1-.1 2-2 .1.1a2 2 0 0 0 2.1.4A2 2 0 0 0 10.8 4v-.1h2.8V4a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.1-.4l.1-.1 2 2-.1.1a2 2 0 0 0-.4 2.1 2 2 0 0 0 1.8 1.2h.1v2.8h-.1a2 2 0 0 0-1.8 1.2Z"/></>};
return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{p[name]}</svg>}

export function ProviderShell({children,title=""}){
 const location=useLocation();
 return <div className="provider-app">
  <aside className="provider-sidebar">
   <Link to="/" className="provider-brand"><img src={logo} alt="Matchet"/></Link>
   <nav>{items.map(i=><Link key={i.path} to={i.path} className={location.pathname===i.path?"active":""}><Icon name={i.icon}/><span>{i.label}</span>{i.badge&&<b>{i.badge}</b>}</Link>)}</nav>
   <div className="provider-sidebar-promo"><Icon name="user" size={32}/><strong>Grow your<br/>business on Matchet</strong><p>Add new services, update your availability, and reach more customers.</p><button>View tips&nbsp; →</button></div>
  </aside>
  <header className="provider-topbar">
   <div className="provider-search">⌕ <span>Search bookings, messages, or help...</span></div>
   <button className="provider-bell">♧<i/></button>
   <div className="provider-account"><img src={avatar} alt="" /><div><strong>{displayName}</strong><small>{user?.role === "provider" ? "Provider" : "Account"}</small></div><span>⌄</span></div>
  </header>
  <main className="provider-main">{children}</main>
 </div>
}
export {Icon};
