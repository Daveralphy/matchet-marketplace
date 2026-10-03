import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBuyerOrders } from "../api/marketplace";
import "./BuyerAccount.css";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBuyerOrders()
      .then(setOrders)
      .catch((e) => setError(e.message || "Unable to load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="buyer-account-page">
      <div className="buyer-account-container">
        <div className="buyer-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>My Orders</span>
        </div>

        <header>
          <h1>My Orders</h1>
          <p>Track your purchases and view your order history.</p>
        </header>

        {loading ? (
          <AccountLoading />
        ) : error ? (
          <AccountError message={error} />
        ) : orders.length ? (
          <div className="buyer-list">
            {orders.map((order) => (
              <article className="buyer-card" key={order._id}>
                <div>
                  <span className={"status-pill " + order.orderStatus}>
                    {order.orderStatus}
                  </span>
                  <h2>Order #{String(order._id).slice(-8).toUpperCase()}</h2>
                  <p>
                    {order.items?.length || 0} item(s) ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="buyer-card-right">
                  <strong>₦{Number(order.total || 0).toLocaleString()}</strong>
                  <span>{order.paymentStatus}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="No orders yet"
            text="Your completed purchases will appear here once you place an order."
            action="/products"
            label="Browse products"
          />
        )}
      </div>
    </main>
  );
}

function AccountLoading() {
  return (
    <div className="buyer-empty">
      <h2>Loading your orders...</h2>
      <p>Fetching your account history.</p>
    </div>
  );
}

function AccountError({ message }) {
  return (
    <div className="buyer-empty">
      <h2>We could not load your orders</h2>
      <p>{message}</p>
      <button type="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  );
}

function Empty({ title, text, action, label }) {
  return (
    <div className="buyer-empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={action}>{label}</Link>
    </div>
  );
}
