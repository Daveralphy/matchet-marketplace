import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderBookings } from "../api/provider";
import "../styles/provider-dashboard.css";

function money(value, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value || 0));
}
function dateLabel(value) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
function timeLabel(value) {
  if (!value) return "";
  const parts = String(value).split(":").map(Number);
  if (parts.length < 2 || parts.some(Number.isNaN)) return value;
  const d = new Date();
  d.setHours(parts[0], parts[1], 0, 0);
  return new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(d);
}
function initials(name) {
  return name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProviderBookings() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProviderBookings()
      .then((response) => { if (active) setData(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load your bookings."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const summary = data?.summary || { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
  const bookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.bookings || []).filter((booking) => {
      const statusMatch =
        tab === "all" ||
        (tab === "upcoming" && ["pending", "confirmed", "inProgress"].includes(booking.status)) ||
        (tab === "completed" && booking.status === "completed") ||
        (tab === "cancelled" && ["cancelled", "declined"].includes(booking.status));
      const searchMatch =
        !query ||
        booking.customer?.name?.toLowerCase().includes(query) ||
        booking.service?.title?.toLowerCase().includes(query);
      return statusMatch && searchMatch;
    });
  }, [data, tab, search]);

  return (
    <ProviderShell>
      <div className="provider-page provider-bookings-page">
        <div className="provider-heading">
          <div><h1>Bookings</h1><span>Manage your bookings, view details, and keep track of your schedule.</span></div>
          <button type="button" className="provider-blue-button"><Icon name="plus" size={18} /> Add availability</button>
        </div>

        {error && <div className="provider-message-error" role="alert">{error}</div>}

        <div className="provider-tabs provider-booking-tabs">
          {[
            ["all", "All bookings"],
            ["upcoming", "Upcoming"],
            ["completed", "Completed"],
            ["cancelled", "Cancelled"],
          ].map(([value, label]) => (
            <button key={value} type="button" className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{label}</button>
          ))}
        </div>

        <div className="provider-stat-grid">
          <div className="provider-stat"><div className="provider-stat-icon calendar"><Icon name="calendar" /></div><strong>{summary.total}</strong><b>Total bookings</b><span>This month</span></div>
          <div className="provider-stat"><div className="provider-stat-icon calendar"><Icon name="clock" /></div><strong>{summary.upcoming}</strong><b>Upcoming</b><span>This month</span></div>
          <div className="provider-stat"><div className="provider-stat-icon user"><Icon name="shield" /></div><strong>{summary.completed}</strong><b>Completed</b><span>This month</span></div>
          <div className="provider-stat"><div className="provider-stat-icon star"><Icon name="bell" /></div><strong>{summary.cancelled}</strong><b>Cancelled</b><span>This month</span></div>
        </div>

        <section className="provider-card provider-bookings-card">
          <div className="provider-bookings-toolbar">
            <div className="provider-services-search"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bookings by customer or service..." /></div>
          </div>

          {loading ? (
            <div className="provider-bookings-loading"><div /><div /><div /><div /></div>
          ) : bookings.length === 0 ? (
            <div className="provider-message-empty provider-bookings-empty">
              <Icon name="calendar" size={36} />
              <strong>{search ? "No matching bookings" : "No bookings yet"}</strong>
              <p>{search ? "Try another customer or service name." : "Bookings will appear here when customers book one of your services."}</p>
            </div>
          ) : (
            <div className="provider-bookings-list">
              <div className="provider-bookings-header"><span>Customer</span><span>Service</span><span>Date &amp; time</span><span>Status</span><span>Amount</span><span /></div>
              {bookings.map((booking) => {
                const name = booking.customer?.name || "Customer";
                return (
                  <div className="provider-booking-row" key={booking.id}>
                    <div className="provider-booking-customer">
                      {booking.customer?.avatar ? <img src={booking.customer.avatar} alt="" /> : <span>{booking.customer?.initials || initials(name)}</span>}
                      <strong>{name}</strong>
                    </div>
                    <div><strong>{booking.service?.title || "Service"}</strong><small>{booking.service?.description || "No description provided."}</small></div>
                    <div><strong>{dateLabel(booking.scheduledDate)}</strong><small>{timeLabel(booking.scheduledTime)}</small></div>
                    <span className={"status " + booking.status}>{booking.status === "inProgress" ? "In progress" : booking.status}</span>
                    <strong>{money(booking.amount, booking.currency)}</strong>
                    <button type="button" aria-label={"View booking for " + name}>›</button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </ProviderShell>
  );
}
