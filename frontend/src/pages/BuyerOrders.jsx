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
              <article className="buyer-order-card" key={order._id}>
                <header className="buyer-order-card-header">
                  <div className="buyer-order-reference">
                    <span className={"status-pill " + String(order.orderStatus || "pending").toLowerCase()}>{order.orderStatus || "Pending"}</span>
                    <h2>Order #{String(order._id).slice(-8).toUpperCase()}</h2>
                    <p>{order.items?.length || 0} item(s) <span>·</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Date unavailable"}</p>
                  </div>
                  <div className="buyer-order-total"><span>Order total</span><strong>₦{Number(order.total || 0).toLocaleString("en-NG")}</strong><small>Payment: {order.paymentStatus || "Pending"}</small></div>
                </header>
                <div className="buyer-order-items">
                  {(order.items || []).map((item, index) => {
                    const image = item.imageSnapshot || item.image || item.productId?.image || item.productId?.images?.[0] || "";
                    const name = item.nameSnapshot || item.productId?.name || item.name || "Product";
                    return <div className="buyer-order-item" key={String(item.productId?._id || item.productId || index) + "-" + index}>
                      {image ? <img src={image} alt="" loading="lazy" /> : <span className="buyer-order-item-placeholder" aria-hidden="true"><span>▧</span></span>}
                      <div className="buyer-order-item-info"><strong>{name}</strong><span>Qty: {Number(item.quantity || 1)}</span><small>Unit price: ₦{Number(item.priceSnapshot || 0).toLocaleString("en-NG")}</small></div>
                      <strong className="buyer-order-item-subtotal">₦{(Number(item.priceSnapshot || 0) * Number(item.quantity || 1)).toLocaleString("en-NG")}</strong>
                    </div>;
                  })}
                </div>
                <footer className="buyer-order-card-footer">
                  <div className="buyer-order-seller-actions">
                    {Array.from(new Map((order.items || []).map((item) => {
                      const seller = item.sellerId;
                      const sellerId = typeof seller === "object" ? seller?._id : seller;
                      return sellerId ? [String(sellerId), { id: String(sellerId), name: typeof seller === "object" ? [seller.firstName, seller.lastName].filter(Boolean).join(" ") : "" }] : ["", null];
                    }).filter(([id]) => id)).values()).map((seller) => (
                      <Link key={seller.id} className="buyer-message-link" to={`/messages?recipient=${encodeURIComponent(seller.id)}`}>Message {seller.name || "seller"}</Link>
                    ))}
                  </div>
                  <Link className="buyer-order-details-link" to={"/orders/" + encodeURIComponent(order._id)}>View order details <span aria-hidden="true">→</span></Link>
                </footer>
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
