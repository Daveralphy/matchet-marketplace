import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminShell } from "../components/AdminShell";
import { Icon } from "../components/ProviderShell";
import { getAdminDashboard } from "../api/admin";
import "../styles/admin-dashboard.css";

function formatNumber(value) {
  return new Intl.NumberFormat("en-NG").format(Number(value || 0));
}
function formatDate(value) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    getAdminDashboard()
      .then((response) => setData(response.data))
      .catch((requestError) => setError(requestError.message || "Unable to load the admin dashboard."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const dateLabel = useMemo(
    () => new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(new Date(data?.generatedAt || Date.now())),
    [data?.generatedAt],
  );

  if (loading) {
    return <AdminShell><div className="admin-page"><div className="admin-card admin-loading-block" /><div className="admin-card admin-loading-block large" /></div></AdminShell>;
  }

  if (error) {
    return <AdminShell><div className="admin-page"><section className="admin-card admin-error"><h2>We could not load the admin dashboard</h2><p>{error}</p><button onClick={load}>Try again</button></section></div></AdminShell>;
  }

  const { stats, pendingApplications = [] } = data;

  return (
    <AdminShell>
      <div className="admin-page">
        <div className="admin-heading">
          <div><p>Welcome back,</p><h1>Administrator!</h1><span>Here is what is happening across the Matchet platform.</span></div>
          <div className="admin-heading-quote">{dateLabel}<strong>People. Products. Services.<br />Stronger communities.</strong></div>
        </div>

        <div className="admin-stat-grid">
          <section className="admin-card admin-stat"><div className="admin-stat-icon blue"><Icon name="user" /></div><strong>{formatNumber(stats.totalUsers)}</strong><b>Total users</b><span>Registered marketplace accounts</span></section>
          <section className="admin-card admin-stat"><div className="admin-stat-icon green"><Icon name="shield" /></div><strong>{formatNumber(stats.activeProviders)}</strong><b>Active providers</b><span>{formatNumber(stats.pendingProviders)} provider applications pending</span></section>
          <section className="admin-card admin-stat"><div className="admin-stat-icon orange"><Icon name="user" /></div><strong>{formatNumber(stats.activeSellers)}</strong><b>Active sellers</b><span>{formatNumber(stats.pendingSellers)} seller applications pending</span></section>
          <section className="admin-card admin-stat"><div className="admin-stat-icon purple"><Icon name="grid" /></div><strong>{formatNumber(stats.activeListings)}</strong><b>Active listings</b><span>{formatNumber(stats.activeProducts)} products · {formatNumber(stats.activeServices)} services</span></section>
        </div>

        <div className="admin-main-grid">
          <section className="admin-card">
            <div className="admin-card-head"><h2>Applications awaiting review</h2><Link to="/admin/providers">Review applications →</Link></div>
            {pendingApplications.length ? pendingApplications.map((application) => (
              <Link key={String(application.id)} to={application.type === "provider" ? "/admin/providers" : "/admin/sellers"} className="admin-application-row" style={{ textDecoration: "none", color: "inherit" }}>
                {application.avatar ? <img className="admin-application-avatar" src={application.avatar} alt="" /> : <div className="admin-application-avatar">{application.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>}
                <div className="admin-application-info"><strong>{application.businessName}</strong><span>{application.name} · {application.email}</span></div>
                <div className="admin-application-meta"><strong>{formatDate(application.submittedAt)}</strong><span>{application.category}</span></div>
                <span className={"admin-type " + application.type}>{application.type === "provider" ? "Provider" : "Seller"}</span>
              </Link>
            )) : <div className="admin-empty"><Icon name="shield" size={28} /><strong>No applications awaiting review</strong><p>New seller and provider applications will appear here.</p></div>}
            {pendingApplications.length > 0 && <div className="admin-review-note">Applications are shown from the live approval queue. Selecting one takes you to the appropriate review workspace.</div>}
          </section>

          <section className="admin-card">
            <div className="admin-card-head"><h2>Platform overview</h2></div>
            <div className="admin-breakdown">
              <div className="admin-breakdown-row"><span>Pending provider approvals</span><strong>{formatNumber(stats.pendingProviders)}</strong></div>
              <div className="admin-breakdown-row"><span>Pending seller approvals</span><strong>{formatNumber(stats.pendingSellers)}</strong></div>
              <div className="admin-breakdown-row"><span>Verified providers</span><strong>{formatNumber(stats.activeProviders)}</strong></div>
              <div className="admin-breakdown-row"><span>Verified sellers</span><strong>{formatNumber(stats.activeSellers)}</strong></div>
              <div className="admin-breakdown-row"><span>Live products</span><strong>{formatNumber(stats.activeProducts)}</strong></div>
              <div className="admin-breakdown-row"><span>Live services</span><strong>{formatNumber(stats.activeServices)}</strong></div>
            </div>
          </section>
        </div>

        <section className="admin-card" style={{ marginTop: 14 }}>
          <div className="admin-card-head"><h2>Quick actions</h2></div>
          <div className="admin-quick-grid">
            <Link to="/admin/providers"><i><Icon name="shield" size={18} /></i><strong>Review providers</strong><p>Review submitted provider applications and approve or reject them.</p></Link>
            <Link to="/admin/sellers"><i><Icon name="user" size={18} /></i><strong>Review sellers</strong><p>Review seller applications and manage marketplace access.</p></Link>
            <Link to="/admin/users"><i><Icon name="user" size={18} /></i><strong>Manage users</strong><p>View and manage marketplace accounts and capabilities.</p></Link>
            <Link to="/admin/listings"><i><Icon name="grid" size={18} /></i><strong>Manage listings</strong><p>Review products and services published on Matchet.</p></Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
