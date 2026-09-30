import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderDashboard } from "../api/provider";
import "../styles/provider-dashboard.css";

function formatCurrency(value, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "";
  const parts = value.split(":").map(Number);
  if (parts.some(Number.isNaN)) return value;
  const date = new Date();
  date.setHours(parts[0], parts[1], 0, 0);
  return new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(date);
}

function statusLabel(status) {
  return { pending: "Pending", confirmed: "Confirmed", inProgress: "In progress" }[status] || status;
}

export default function ProviderDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getProviderDashboard()
      .then((response) => { if (mounted) setData(response.data); })
      .catch((requestError) => { if (mounted) setError(requestError.message || "Unable to load your dashboard."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const greetingName = data?.provider?.firstName || data?.provider?.name || "there";
  const generatedDate = useMemo(() => data?.generatedAt ? new Date(data.generatedAt) : new Date(), [data?.generatedAt]);

  if (loading) return <ProviderShell><div className="provider-page provider-dashboard-loading"><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton large" /></div></ProviderShell>;

  if (error) return <ProviderShell><div className="provider-page"><section className="provider-card provider-dashboard-error"><h2>We could not load your dashboard</h2><p>{error}</p><button className="provider-blue-button" onClick={() => window.location.reload()}>Try again</button></section></div></ProviderShell>;

  const { kpis, upcomingBookings = [], recentMessages = [], unreadMessages = 0 } = data;
  const dateLabel = new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(generatedDate);

  return (
    <ProviderShell>
      <div className="provider-page provider-dashboard">
        <div className="provider-heading">
          <div><p>Welcome back,</p><h1>{greetingName}!</h1><span>Here is what is happening with your provider account.</span></div>
          <div className="provider-heading-quote">{dateLabel}<br /><strong>People. Services.<br />Stronger communities.</strong><em /></div>
        </div>

        {data.application?.isUnderReview && <section className="provider-review-banner"><div className="provider-check">✓</div><div><strong>Your provider application is under review</strong><p>Thank you for applying to become a provider on Matchet. Our team is reviewing your information and will notify you once your profile is approved.</p></div><Link to="/provider/application-status">View application&nbsp; →</Link></section>}

        <div className="provider-stat-grid">
          <div className="provider-stat"><div className="provider-stat-icon calendar"><Icon name="calendar" /></div><strong>{kpis.bookings.value}</strong><b>Total bookings</b><span>This month {kpis.bookings.change !== null && <small className="provider-kpi-change">↗ {kpis.bookings.change >= 0 ? "+" : ""}{kpis.bookings.change}%</small>}</span></div>
          <div className="provider-stat"><div className="provider-stat-icon user"><Icon name="user" /></div><strong>{kpis.customers.value}</strong><b>New customers</b><span>This month {kpis.customers.change !== null && <small className="provider-kpi-change">↗ {kpis.customers.change >= 0 ? "+" : ""}{kpis.customers.change}%</small>}</span></div>
          <div className="provider-stat"><div className="provider-stat-icon wallet"><Icon name="wallet" /></div><strong>{formatCurrency(kpis.earnings.value, kpis.earnings.currency)}</strong><b>Total earnings</b><span>This month {kpis.earnings.change !== null && <small className="provider-kpi-change">↗ {kpis.earnings.change >= 0 ? "+" : ""}{kpis.earnings.change}%</small>}</span></div>
          <div className="provider-stat"><div className="provider-stat-icon star"><Icon name="star" /></div><strong>{kpis.rating.value || "0"}</strong><b>Average rating</b><span>{kpis.rating.reviewCount > 0 ? "From " + kpis.rating.reviewCount + " reviews" : "No reviews yet"} {kpis.rating.change !== null && <small className="provider-kpi-change">↗ {kpis.rating.change >= 0 ? "+" : ""}{kpis.rating.change}</small>}</span></div>
        </div>

        <div className="provider-dashboard-main-grid">
          <section className="provider-card provider-upcoming"><h2>Upcoming bookings <Link to="/provider/bookings">View all</Link></h2>
            {upcomingBookings.length === 0 ? <div className="provider-dashboard-empty"><Icon name="calendar" size={28} /><strong>No upcoming bookings</strong><p>Your upcoming bookings will appear here.</p></div> : upcomingBookings.map((booking) => (
              <Link to="/provider/bookings" className="provider-upcoming-row" key={booking.id}>
                <div className="provider-service-image">{booking.service.image ? <img src={booking.service.image} alt="" /> : <Icon name="grid" size={22} />}</div>
                <div className="provider-upcoming-service"><strong>{booking.service.title}</strong><span>{booking.customer.name || "Customer"}</span></div>
                <div className="provider-upcoming-meta"><span><Icon name="calendar" size={15} /> {formatDate(booking.scheduledDate)}</span><span><Icon name="clock" size={15} /> {formatTime(booking.scheduledTime)}</span></div>
                <span className={"status " + booking.status}>{statusLabel(booking.status)}</span><span className="provider-row-arrow">›</span>
              </Link>
            ))}
          </section>

          <section className="provider-card provider-recent-messages"><h2>Recent messages <Link to="/provider/messages">View all</Link></h2>
            {recentMessages.length === 0 ? <div className="provider-dashboard-empty compact"><Icon name="message" size={25} /><strong>No messages yet</strong><p>Customer conversations will appear here.</p></div> : recentMessages.map((message) => (
              <Link to="/provider/messages" className="provider-message-row" key={message.id}>
                {message.customer.avatar ? <img src={message.customer.avatar} alt="" /> : <div className="provider-avatar">{message.customer.initials || "?"}</div>}
                <div><strong>{message.customer.name || "Customer"}</strong><p>{message.content}</p></div>
                <time>{new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time>
                {message.unread && <b>{unreadMessages}</b>}
              </Link>
            ))}
          </section>
        </div>

        <div className="provider-dashboard-bottom-grid">
          <section className="provider-card provider-quick-actions"><h2>Quick actions</h2><div className="provider-ready-grid">
            <Link to="/provider/services"><i><Icon name="plus" size={20} /></i><strong>Add a new service</strong><p>Reach more customers by offering more services.</p><span>Add service&nbsp; →</span></Link>
            <Link to="/provider/settings"><i><Icon name="calendar" size={20} /></i><strong>Manage availability</strong><p>Update the days and times you are available.</p><span>Update schedule&nbsp; →</span></Link>
            <Link to="/provider/earnings"><i><Icon name="wallet" size={20} /></i><strong>View earnings</strong><p>Check your income and transaction history.</p><span>View earnings&nbsp; →</span></Link>
            <Link to="/provider/profile"><i><Icon name="user" size={20} /></i><strong>Edit profile</strong><p>Keep your provider information up to date.</p><span>Edit profile&nbsp; →</span></Link>
          </div></section>
          <section className="provider-card provider-help"><h2>Need help?</h2><p>Our support team is here to help. If you have any questions, feel free to reach out.</p><button>♧&nbsp;&nbsp; Contact support</button></section>
        </div>
      </div>
    </ProviderShell>
  );
}