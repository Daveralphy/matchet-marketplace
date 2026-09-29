import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getSellerDashboard } from "../api/provider";
import "../styles/seller-dashboard.css";

function money(value) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(value || 0));
}
function date(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
function statusLabel(status) {
  return ({ pending: "Pending", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" }[status] || status || "Pending");
}

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    getSellerDashboard().then((response) => setData(response.data)).catch((e) => setError(e.message || "Unable to load your seller dashboard.")).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const generatedDate = useMemo(() => data?.generatedAt ? new Date(data.generatedAt) : new Date(), [data?.generatedAt]);
  const greetingName = data?.store?.name || "your store";
  const dateLabel = new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(generatedDate);

  if (loading) return <ProviderShell mode="seller"><div className="seller-page seller-loading"><div /><div /><div /></div></ProviderShell>;
  if (error) return <ProviderShell mode="seller"><div className="seller-page"><section className="seller-card seller-error"><h2>We could not load your seller dashboard</h2><p>{error}</p><button onClick={load}>Try again</button></section></div></ProviderShell>;

  const { kpis, recentOrders = [], recentMessages = [], unreadMessages = 0, products = {}, application = {} } = data;

  return (
    <ProviderShell mode="seller">
      <div className="seller-page">
        <div className="seller-heading">
          <div><p>Welcome back,</p><h1>{greetingName}!</h1><span>Here is what is happening with your seller account.</span></div>
          <div className="seller-heading-quote">{dateLabel}<br /><strong>People. Products.<br />Stronger communities.</strong><em /></div>
        </div>

        {application.pending && (
          <section className="seller-review-banner">
            <div className="seller-check">✓</div>
            <div><strong>Your seller application is under review</strong><p>Thank you for applying to sell on Matchet. Our team is reviewing your store information and will notify you once your seller account is approved.</p></div>
            <span>Pending approval</span>
          </section>
        )}

        {application.rejected && (
          <section className="seller-review-banner rejected">
            <div className="seller-check">!</div>
            <div><strong>Your seller application needs attention</strong><p>{data.store?.reviewNote || "Please review your seller information and resubmit your application."}</p></div>
            <Link to="/seller/profile">Review application&nbsp; →</Link>
          </section>
        )}

        <div className="seller-stat-grid">
          <div className="seller-stat"><div className="seller-stat-icon blue"><Icon name="calendar" /></div><strong>{kpis.orders.value}</strong><b>Total orders</b><span>This month {kpis.orders.change !== null && <small>↗ {kpis.orders.change >= 0 ? "+" : ""}{kpis.orders.change}%</small>}</span></div>
          <div className="seller-stat"><div className="seller-stat-icon green"><Icon name="user" /></div><strong>{kpis.customers.value}</strong><b>New customers</b><span>This month {kpis.customers.change !== null && <small>↗ {kpis.customers.change >= 0 ? "+" : ""}{kpis.customers.change}%</small>}</span></div>
          <div className="seller-stat"><div className="seller-stat-icon orange"><Icon name="wallet" /></div><strong>{money(kpis.sales.value)}</strong><b>Total sales</b><span>This month {kpis.sales.change !== null && <small>↗ {kpis.sales.change >= 0 ? "+" : ""}{kpis.sales.change}%</small>}</span></div>
          <div className="seller-stat"><div className="seller-stat-icon purple"><Icon name="star" /></div><strong>{kpis.rating.value || "0"}</strong><b>Average rating</b><span>{kpis.rating.reviewCount ? "From " + kpis.rating.reviewCount + " reviews" : "No reviews yet"}</span></div>
        </div>

        <div className="seller-main-grid">
          <section className="seller-card seller-orders"><h2>Recent orders <Link to="/seller/orders">View all</Link></h2>
            {recentOrders.length ? recentOrders.map((order) => (
              <Link to="/seller/orders" className="seller-order-row" key={order.id}>
                <div className="seller-product-image">{order.product.image ? <img src={order.product.image} alt="" /> : <Icon name="grid" size={22} />}</div>
                <div className="seller-order-product"><strong>{order.product.name}</strong><span>{order.customer.name}</span></div>
                <div className="seller-order-meta"><span>{date(order.date)}</span><span>Qty {order.quantity}</span></div>
                <span className={"seller-status " + order.status}>{statusLabel(order.status)}</span>
                <strong className="seller-order-amount">{money(order.amount)}</strong>
              </Link>
            )) : <div className="seller-empty"><Icon name="calendar" size={28} /><strong>No orders yet</strong><p>Your customer orders will appear here.</p></div>}
          </section>

          <section className="seller-card seller-messages"><h2>Recent messages <Link to="/seller/messages">View all</Link></h2>
            {recentMessages.length ? recentMessages.map((message) => (
              <Link to="/seller/messages" className="seller-message-row" key={message.id}>
                {message.customer.avatar ? <img src={message.customer.avatar} alt="" /> : <div className="seller-avatar">{message.customer.initials || "?"}</div>}
                <div><strong>{message.customer.name}</strong><p>{message.content}</p></div>
                <time>{new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time>
                {message.unread && <b>{unreadMessages}</b>}
              </Link>
            )) : <div className="seller-empty compact"><Icon name="message" size={25} /><strong>No messages yet</strong><p>Customer conversations will appear here.</p></div>}
          </section>
        </div>

        <div className="seller-bottom-grid">
          <section className="seller-card seller-quick-actions"><h2>Quick actions</h2><div className="seller-action-grid">
            <Link to="/seller/products"><i><Icon name="plus" size={20} /></i><strong>Add product</strong><p>List a new product in your store.</p><span>Add product&nbsp; →</span></Link>
            <Link to="/seller/products"><i><Icon name="grid" size={20} /></i><strong>Manage inventory</strong><p>Update stock levels and availability.</p><span>Manage inventory&nbsp; →</span></Link>
            <Link to="/seller/earnings"><i><Icon name="wallet" size={20} /></i><strong>View earnings</strong><p>Check your sales and payouts.</p><span>View earnings&nbsp; →</span></Link>
            <Link to="/seller/profile"><i><Icon name="grid" size={20} /></i><strong>Edit store</strong><p>Update your store profile and settings.</p><span>Edit store&nbsp; →</span></Link>
          </div></section>
          <section className="seller-card seller-help"><h2>Need help?</h2><p>Our support team is here to help. If you have any questions, feel free to reach out.</p><button>♧&nbsp;&nbsp; Contact support&nbsp; →</button></section>
        </div>

        <section className="seller-card seller-product-summary"><div><h2>Your store</h2><p>{products.total} product{products.total === 1 ? "" : "s"} · {products.active} active · {products.draft} draft · {products.outOfStock} out of stock</p></div><Link to="/seller/products">Manage products&nbsp; →</Link></section>
      </div>
    </ProviderShell>
  );
}
