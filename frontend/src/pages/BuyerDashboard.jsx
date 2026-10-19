import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBuyerOrders, getBuyerBookings, getSavedItems } from "../api/marketplace";
import "../styles/account/dashboard.css";

const money = (value, currency = "NGN") => new Intl.NumberFormat("en-NG", {
  style: "currency", currency, maximumFractionDigits: 0,
}).format(Number(value || 0));

const shortDate = (value) => {
  if (!value) return "Date not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date not available" : new Intl.DateTimeFormat("en-NG", {
    month: "short", day: "numeric", year: "numeric",
  }).format(date);
};

const statusText = (value) => String(value || "pending").replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getBuyerOrders(), getBuyerBookings(), getSavedItems()]).then((results) => {
      if (!active) return;
      const failures = [];
      if (results[0].status === "fulfilled") setOrders(results[0].value || []);
      else failures.push("orders");
      if (results[1].status === "fulfilled") setBookings(results[1].value || []);
      else failures.push("bookings");
      if (results[2].status === "fulfilled") setSavedItems(results[2].value || []);
      else failures.push("saved items");
      setErrors(failures);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const firstName = user?.firstName || user?.name?.split?.(" ")?.[0] || "there";
  const recentOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4), [orders]);
  const recentBookings = useMemo(() => [...bookings].sort((a, b) => new Date(b.createdAt || b.scheduledDate || 0) - new Date(a.createdAt || a.scheduledDate || 0)).slice(0, 4), [bookings]);
  const pendingOrders = orders.filter((order) => ["pending", "confirmed", "processing", "shipped"].includes(String(order.orderStatus || "").toLowerCase())).length;
  const upcomingBookings = bookings.filter((booking) => {
    const date = new Date(booking.scheduledDate);
    return !Number.isNaN(date.getTime()) && date >= new Date() && !["cancelled", "completed", "rejected"].includes(String(booking.status || "").toLowerCase());
  }).length;
  const totalSpent = orders.filter((order) => !["cancelled", "refunded", "failed"].includes(String(order.orderStatus || "").toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0);
  const today = new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(new Date());

  if (loading) return <main className="buyer-dashboard-page"><div className="buyer-dashboard-shell"><div className="buyer-dashboard-skeleton hero" /><div className="buyer-dashboard-skeleton stats" /><div className="buyer-dashboard-skeleton content" /></div></main>;

  return (
    <main className="buyer-dashboard-page">
      <div className="buyer-dashboard-shell">
        <header className="buyer-dashboard-heading">
          <div><p>Welcome back,</p><h1>{firstName}!</h1><span>Here is what is happening with your Matchet account.</span></div>
          <div className="buyer-dashboard-date">{today}<strong>Discover. Shop.<br />Support local talent.</strong></div>
        </header>

        {errors.length > 0 && <div className="buyer-dashboard-notice" role="status">Some account information could not load ({errors.join(", ")}). You can still use the links below, or refresh this page to try again.</div>}

        <section className="buyer-dashboard-stats" aria-label="Account summary">
          <article className="buyer-dashboard-stat"><span className="buyer-stat-icon blue">▣</span><strong>{orders.length}</strong><b>Total orders</b><small>{pendingOrders} in progress</small></article>
          <article className="buyer-dashboard-stat"><span className="buyer-stat-icon green">▦</span><strong>{bookings.length}</strong><b>Service bookings</b><small>{upcomingBookings} upcoming</small></article>
          <article className="buyer-dashboard-stat"><span className="buyer-stat-icon orange">₦</span><strong>{money(totalSpent)}</strong><b>Total purchases</b><small>Excluding cancelled orders</small></article>
          <article className="buyer-dashboard-stat"><span className="buyer-stat-icon purple">♡</span><strong>{savedItems.length}</strong><b>Saved items</b><small>Products and services you saved</small></article>
        </section>

        <div className="buyer-dashboard-main-grid">
          <section className="buyer-dashboard-card">
            <h2>Recent orders <Link to="/orders">View all</Link></h2>
            {recentOrders.length ? <div className="buyer-dashboard-list">{recentOrders.map((order) => (
              <Link className="buyer-dashboard-order" to="/orders" key={order._id}>
                <div className="buyer-order-thumb">{order.items?.[0]?.image ? <img src={order.items[0].image} alt="" /> : <span>▣</span>}</div>
                <div className="buyer-order-copy"><strong>Order #{String(order._id || "").slice(-8).toUpperCase()}</strong><span>{order.items?.length || 0} item(s) · {shortDate(order.createdAt)}</span></div>
                <div className="buyer-order-right"><strong>{money(order.total)}</strong><span className={"buyer-order-status " + String(order.orderStatus || "pending").toLowerCase()}>{statusText(order.orderStatus)}</span></div>
              </Link>
            ))}</div> : <div className="buyer-dashboard-empty"><strong>No orders yet</strong><p>Your purchases will appear here after checkout.</p><Link to="/products">Browse products →</Link></div>}
          </section>

          <section className="buyer-dashboard-card">
            <h2>Upcoming bookings <Link to="/bookings">View all</Link></h2>
            {recentBookings.length ? <div className="buyer-dashboard-list">{recentBookings.map((booking) => (
              <Link className="buyer-dashboard-booking" to="/bookings" key={booking._id}>
                <div className="buyer-booking-icon">▦</div>
                <div className="buyer-booking-copy"><strong>{booking.serviceId?.title || "Service booking"}</strong><span>{shortDate(booking.scheduledDate)}{booking.scheduledTime ? " · " + booking.scheduledTime : ""}</span></div>
                <div className="buyer-order-right"><strong>{money(booking.priceSnapshot?.amount, booking.priceSnapshot?.currency === "NGN" ? "NGN" : (booking.priceSnapshot?.currency || "NGN"))}</strong><span className={"buyer-order-status " + String(booking.status || "pending").toLowerCase()}>{statusText(booking.status)}</span></div>
              </Link>
            ))}</div> : <div className="buyer-dashboard-empty"><strong>No bookings yet</strong><p>Your scheduled services will appear here.</p><Link to="/services">Explore services →</Link></div>}
          </section>
        </div>

        <div className="buyer-dashboard-bottom-grid">
          <section className="buyer-dashboard-card buyer-dashboard-actions"><h2>Quick actions</h2><div className="buyer-action-grid">
            <Link to="/products"><i>⌕</i><strong>Explore products</strong><p>Find products from local sellers.</p><span>Shop now →</span></Link>
            <Link to="/services"><i>▦</i><strong>Find a service</strong><p>Connect with trusted service providers.</p><span>Explore services →</span></Link>
            <Link to="/saved-items"><i>♡</i><strong>Saved items</strong><p>Return to products and services you saved.</p><span>View saved →</span></Link>
            <Link to="/profile"><i>♙</i><strong>Update profile</strong><p>Keep your account information up to date.</p><span>Edit profile →</span></Link>
          </div></section>
          <section className="buyer-dashboard-card buyer-dashboard-help"><h2>Need help?</h2><p>Need help with an order or booking? Our support team is here to help you.</p><Link to="/help">Contact support →</Link><div className="buyer-help-foot">Your Matchet account, all in one place.</div></section>
        </div>
      </div>
    </main>
  );
}
