import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBuyerOrder, getBuyerOrderReviews, submitBuyerOrderReview } from "../api/marketplace";
import "./BuyerAccount.css";
import "./BuyerOrderDetails.css";

const money = (value, currency = "NGN") => currency + " " + Number(value || 0).toLocaleString("en-NG");

export default function BuyerOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewSubmitting, setReviewSubmitting] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getBuyerOrder(orderId)
      .then(async (value) => {
        if (!active) return;
        setOrder(value);
        try {
          const savedReviews = await getBuyerOrderReviews(orderId);
          if (active) setReviews(savedReviews);
        } catch {
          if (active) setReviews([]);
        }
      })
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
            <section className="buyer-order-detail-card buyer-order-progress">
              <div className="buyer-order-progress-heading"><div><h2>Order progress</h2><p>Follow your order from placement to delivery.</p></div><span className={"status-pill " + String(order.orderStatus || "pending").toLowerCase()}>{String(order.orderStatus || "Pending").replace(/[_-]/g, " ")}</span></div>
              {(() => {
                const status = String(order.orderStatus || "pending").toLowerCase().replace(/[_\s-]+/g, "");
                const cancelled = ["cancelled", "canceled", "declined", "refunded"].includes(status);
                const stages = [
                  { key: "placed", label: "Order placed", detail: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-NG") : "Order received" },
                  { key: "paid", label: "Payment confirmed", detail: String(order.paymentStatus || "pending").toLowerCase() === "paid" || String(order.paymentStatus || "").toLowerCase() === "successful" ? "Payment received" : "Awaiting payment" },
                  { key: "processing", label: "Processing", detail: "Seller is preparing your order" },
                  { key: "shipped", label: "Shipped", detail: "Order handed over for delivery" },
                  { key: "out_for_delivery", label: "Out for delivery", detail: "Your order is on its way to your address" },
                  { key: "delivered", label: "Delivered", detail: "Order delivery completed" }
                ];
                let current = 0;
                if (["paid", "successful", "completed", "confirmed", "processing", "shipped", "dispatched", "outfordelivery", "delivered"].includes(status)) current = 2;
                if (["shipped", "dispatched"].includes(status)) current = 3;
                if (["out_for_delivery", "outfordelivery"].includes(status)) current = 4;
                if (["delivered", "completed"].includes(status)) current = 5;
                if (["processing", "confirmed"].includes(status)) current = 2;
                const paymentConfirmed = ["paid", "successful", "completed", "confirmed"].includes(String(order.paymentStatus || "").toLowerCase());
                if (paymentConfirmed) current = Math.max(current, 1);
                return <>
                  {cancelled && <div className="buyer-order-cancelled-note">This order is marked {String(order.orderStatus).replace(/[_-]/g, " ")}. The timeline below shows the normal order journey.</div>}
                  <div className="buyer-order-timeline" aria-label="Order progress">
                    {stages.map((stage, index) => {
                      const complete = !cancelled && index <= current;
                      const active = !cancelled && index === current;
                      return <div className={"buyer-order-timeline-step" + (complete ? " is-complete" : "") + (active ? " is-current" : "")} key={stage.key}>
                        <div className="buyer-order-timeline-marker">{complete ? "✓" : index + 1}</div>
                        <div className="buyer-order-timeline-copy"><strong>{stage.label}</strong><span>{index === 0 && order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-NG") : stage.detail}</span></div>
                        {index < stages.length - 1 && <span className="buyer-order-timeline-connector" aria-hidden="true" />}
                      </div>;
                    })}
                  </div>
                </>;
              })()}
              <div className="buyer-order-progress-meta">
                <div><span>Payment</span><strong>{String(order.paymentStatus || "pending").replace(/[_-]/g, " ")}</strong></div>
                <div><span>Delivery method</span><strong>{String(order.deliveryMethod || "delivery").replace(/[_-]/g, " ")}</strong></div>
                {order.shippingAddress && <div><span>Delivery address</span><strong>{[order.shippingAddress.addressLine1, order.shippingAddress.addressLine2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.country].filter(Boolean).join(", ") || "No address provided"}</strong></div>}
              </div>
            </section>

            {String(order.paymentStatus || "").toLowerCase() === "paid" && String(order.orderStatus || "").toLowerCase() === "delivered" && (
              <section className="buyer-order-detail-card buyer-order-review-section">
                <div className="buyer-order-detail-title"><h2>Rate your purchase</h2><span>Verified order</span></div>
                <p className="buyer-order-review-intro">Tell other buyers about each product. You can submit one review per product.</p>
                {reviewError && <p className="buyer-order-review-feedback error" role="alert">{reviewError}</p>}
                {reviewSuccess && <p className="buyer-order-review-feedback success" role="status">{reviewSuccess}</p>}
                {(order.items || []).map((item, index) => {
                  const productId = String(item.productId?._id || item.productId || "");
                  const existing = reviews.find((review) => String(review.productId?._id || review.productId) === productId);
                  const draft = reviewDrafts[productId] || { rating: 0, comment: "" };
                  return (
                    <article className="buyer-order-review-item" key={productId || index}>
                      <div className="buyer-order-review-product">
                        {item.imageSnapshot ? <img src={item.imageSnapshot} alt="" /> : <span className="buyer-order-detail-placeholder">▧</span>}
                        <div><strong>{item.nameSnapshot || "Product"}</strong><span>{existing ? "Your review" : "Your rating"}</span></div>
                      </div>
                      {existing ? (
                        <div className="buyer-order-review-existing"><strong aria-label={existing.rating + " out of 5 stars"}>{"★".repeat(existing.rating)}{"☆".repeat(5 - existing.rating)} </strong><p>{existing.comment || "No written comment."}</p><span>Review submitted</span></div>
                      ) : (
                        <form className="buyer-order-review-form" onSubmit={async (event) => {
                          event.preventDefault();
                          setReviewError("");
                          setReviewSuccess("");
                          if (!draft.rating) { setReviewError("Choose a star rating before submitting."); return; }
                          setReviewSubmitting(productId);
                          try {
                            await submitBuyerOrderReview(orderId, { productId, rating: draft.rating, comment: draft.comment });
                            const updated = await getBuyerOrderReviews(orderId);
                            setReviews(updated);
                            setReviewSuccess("Your review for " + (item.nameSnapshot || "this product") + " has been submitted.");
                          } catch (submitError) {
                            setReviewError(submitError.message || "Your review could not be saved. Please try again.");
                          } finally {
                            setReviewSubmitting("");
                          }
                        }}>
                          <div className="buyer-order-review-stars" role="radiogroup" aria-label={"Rating for " + (item.nameSnapshot || "product")}>
                            {[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" role="radio" aria-checked={draft.rating === rating} aria-label={rating + " star" + (rating === 1 ? "" : "s")} className={rating <= draft.rating ? "selected" : ""} onClick={() => setReviewDrafts((current) => ({ ...current, [productId]: { ...draft, rating } }))}>★</button>)}
                          </div>
                          <textarea maxLength={2000} value={draft.comment} onChange={(event) => setReviewDrafts((current) => ({ ...current, [productId]: { ...draft, comment: event.target.value } }))} placeholder="Write a review about this product..." aria-label={"Review for " + (item.nameSnapshot || "product")} />
                          <button type="submit" disabled={reviewSubmitting === productId}>{reviewSubmitting === productId ? "Submitting…" : "Submit review"}</button>
                        </form>
                      )}
                    </article>
                  );
                })}
              </section>
            )}

            <div className="buyer-order-detail-actions"><Link to="/orders">Back to orders</Link><Link to="/messages">Go to messages</Link></div>
          </>
        }
      </div>
    </main>
  );
}
