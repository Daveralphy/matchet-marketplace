import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBuyerBookings } from "../api/marketplace";
import BookingReviewPanel from "../components/BookingReviewPanel";
import "./BuyerAccount.css";

export default function BuyerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBuyerBookings()
      .then(setBookings)
      .catch((requestError) => setError(requestError.message || "Unable to load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="buyer-account-page">
      <div className="buyer-account-container">
        <div className="buyer-breadcrumb"><Link to="/">Home</Link><span>›</span><span>My Bookings</span></div>
        <header><h1>My Bookings</h1><p>View and manage your scheduled services.</p></header>
        {loading ? <div className="buyer-empty"><h2>Loading your bookings...</h2><p>Fetching your service history.</p></div>
          : error ? <div className="buyer-empty"><h2>We could not load your bookings</h2><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div>
          : bookings.length ? <div className="buyer-booking-list">
            {bookings.map((booking) => {
              const service = booking.serviceId && typeof booking.serviceId === "object" ? booking.serviceId : null;
              const provider = booking.providerId && typeof booking.providerId === "object" ? booking.providerId : null;
              const title = service?.title || service?.name || booking.serviceTitle || "Service booking";
              const image = service?.coverImage || service?.image || service?.images?.[0] || service?.thumbnail || "";
              const providerName = provider ? [provider.firstName, provider.lastName].filter(Boolean).join(" ") || provider.businessName || provider.name : "";
              const amount = Number(booking.priceSnapshot?.amount ?? booking.priceSnapshot ?? 0);
              const currency = booking.priceSnapshot?.currency || "NGN";
              const id = String(booking._id);
              const providerId = provider ? provider._id : booking.providerId;
              return (
                <article className="buyer-booking-card" key={id}>
                  <div className="buyer-booking-main">
                    {image ? <img className="buyer-booking-image" src={image} alt="" loading="lazy" /> : <span className="buyer-booking-image buyer-booking-placeholder" aria-hidden="true">✦</span>}
                    <div className="buyer-booking-info">
                      <span className={"status-pill " + String(booking.status || "pending").toLowerCase()}>{booking.status || "Pending"}</span>
                      <h2>{title}</h2>
                      {providerName && <p className="buyer-booking-provider">Provided by {providerName}</p>}
                      <p className="buyer-booking-schedule"><span aria-hidden="true">◷</span> {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : "Date to be confirmed"}{booking.scheduledTime ? " · " + booking.scheduledTime : ""}</p>
                      <small>Booking ID: {id.slice(-8).toUpperCase()}</small>
                    </div>
                    <div className="buyer-booking-price"><span>Booking price</span><strong>{currency} {amount.toLocaleString("en-NG")}</strong></div>
                  </div>
                  <BookingReviewPanel booking={booking} />
                  <footer className="buyer-booking-footer">
                    <span>Booking reference: #{id.slice(-8).toUpperCase()}</span>
                    <div className="buyer-booking-actions">
                      {providerId && <Link className="buyer-message-link" to={"/messages?recipient=" + encodeURIComponent(providerId)}>Message provider</Link>}

                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
          : <div className="buyer-empty"><h2>No bookings yet</h2><p>Your scheduled services will appear here.</p><Link to="/services">Explore services</Link></div>}
      </div>
    </main>
  );
}
