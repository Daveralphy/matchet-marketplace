import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBuyerOrder } from "../api/marketplace";
import "./BuyerAccount.css";
import "./BuyerOrderDetails.css";

const money = (value, currency = "NGN") => currency + " " + Number(value || 0).toLocaleString("en-NG");

export default function BuyerOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getBuyerOrder(orderId)
      .then((value) => { if (active) setOrder(value); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load this order."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId]);

  return (
    <main className="buyer-account-page">
      <div className="buyer-account-container">
        <nav className="buyer-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>›</span><Link to="/orders">My Orders</Link><span>›</span><span>Order details</span>
        </nav>
        {loading ? <div className="buyer-empty"><h2>Loading order details…</h2></div> :
          error || !order ? <div className="buyer-empty"><h2>We could not load this order</h2><p>{error || "This order could not be found in your account."}</p><Link to="/orders">Back to my orders</Link></div> :
          <>
            <header className="buyer-order-detail-heading">
              <div><span className={"status-pill " + String(order.orderStatus || "pending")}>{order.orderStatus || "pending"}</span><h1>Order #{String(order._id).slice(-8).toUpperCase()}</h1><p>Placed {order.createdAt ? new Date(order.createdAt).toLocaleString("en-NG") : "date unavailable"}</p></div>
              <Link className="buyer-order-message-seller" to={"/messages"}>Open messages</Link>
            </header>
            <section className="buyer-order-detail-card">
              <div className="buyer-order-detail-title"><h2>Items in this order</h2><span>{order.items?.length || 0} item(s)</span></div>
              {(order.items || []).map((item, index) => (
                <article className="buyer-order-detail-item" key={String(item.productId || index) + "-" + index}>
                  {item.imageSnapshot ? <img src={item.imageSnapshot} alt="" /> : <span className="buyer-order-detail-placeholder">▧</span>}
                  <div><strong>{item.nameSnapshot || "Product"}</strong><span>Quantity: {item.quantity || 1}</span><span>Unit price: {money(item.priceSnapshot, order.currency)}</span></div>
                  <b>{money(Number(item.priceSnapshot || 0) * Number(item.quantity || 1), order.currency)}</b>
                </article>
              ))}
              <div className="buyer-order-detail-totals"><div><span>Subtotal</span><strong>{money(order.subtotal, order.currency)}</strong></div><div><span>Delivery</span><strong>{money(order.deliveryFee, order.currency)}</strong></div><div className="grand-total"><span>Total</span><strong>{money(order.total, order.currency)}</strong></div></div>
            </section>
            <section className="buyer-order-detail-card buyer-order-detail-status">
              <h2>Payment and delivery</h2>
              <div><span>Payment status</span><strong>{order.paymentStatus || "pending"}</strong></div>
              <div><span>Delivery method</span><strong>{order.deliveryMethod || "delivery"}</strong></div>
              <div><span>Order status</span><strong>{order.orderStatus || "pending"}</strong></div>
              {order.shippingAddress && <div><span>Delivery address</span><strong>{[order.shippingAddress.addressLine1, order.shippingAddress.addressLine2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.country].filter(Boolean).join(", ") || "No address provided"}</strong></div>}
            </section>
            <div className="buyer-order-detail-actions"><Link to="/orders">Back to orders</Link><Link to="/messages">Go to messages</Link></div>
          </>
        }
      </div>
    </main>
  );
}
