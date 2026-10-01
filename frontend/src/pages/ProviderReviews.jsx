import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderReviews } from "../api/provider";
import "../styles/provider-dashboard.css";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function Stars({ rating }) {
  return (
    <span className="provider-review-stars" aria-label={rating + " out of 5 stars"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "filled" : "empty"}>★</span>
      ))}
    </span>
  );
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProviderReviews() {
  const [data, setData] = useState(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const perPage = 5;

  useEffect(() => {
    let active = true;
    getProviderReviews()
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load your reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const summary = data?.summary;
  const filteredReviews = useMemo(() => {
    let reviews = [...(data?.reviews || [])];
    if (ratingFilter !== "all") {
      reviews = reviews.filter((review) => review.rating === Number(ratingFilter));
    }
    reviews.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "highest") return b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "lowest") return a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return reviews;
  }, [data, ratingFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredReviews.length / perPage));
  const visibleReviews = filteredReviews.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [ratingFilter, sort]);

  const highlights = (data?.reviews || []).filter((review) => review.comment?.trim()).slice(0, 3);

  return (
    <ProviderShell>
      <div className="provider-page provider-reviews-page">
        <div className="provider-heading">
          <div>
            <h1>Reviews</h1>
            <span>See what your customers are saying and track your ratings.</span>
          </div>
        </div>

        {error && <div className="provider-message-error" role="alert">{error}</div>}

        <div className="provider-stat-grid provider-review-stats">
          <div className="provider-stat">
            <div className="provider-stat-icon star"><Icon name="star" /></div>
            <strong>{summary?.averageRating ?? 0}</strong>
            <b>Average rating</b>
            <span>From {summary?.totalReviews ?? 0} reviews</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon customers"><Icon name="users" /></div>
            <strong>{summary?.totalReviews ?? 0}</strong>
            <b>Total reviews</b>
            <span>All time</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon thumb"><Icon name="check" /></div>
            <strong>{summary?.totalReviews ? Math.round(((summary.ratingBreakdown?.find((item) => item.rating >= 4)?.count || 0) / summary.totalReviews) * 100) : 0}%</strong>
            <b>Positive ratings</b>
            <span>4 and 5 star reviews</span>
          </div>
          <div className="provider-stat">
            <div className="provider-stat-icon quality"><Icon name="star" /></div>
            <strong>{summary?.serviceQuality ?? 0}</strong>
            <b>Service quality</b>
            <span>Average score</span>
          </div>
        </div>

        <div className="provider-reviews-layout">
          <section className="provider-card provider-reviews-list">
            <div className="provider-reviews-toolbar">
              <h2>All reviews</h2>
              <div>
                <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="provider-services-loading">Loading reviews...</div>
            ) : visibleReviews.length === 0 ? (
              <div className="provider-review-empty">
                <Icon name="star" size={30} />
                <strong>No reviews yet</strong>
                <span>Customer reviews will appear here after they are published.</span>
              </div>
            ) : (
              <>
                <div>
                  {visibleReviews.map((review) => {
                    const customerName = review.customer?.name || "Customer";
                    return (
                      <article className="provider-review-item" key={review.id}>
                        {review.customer?.avatar ? (
                          <img className="provider-review-avatar" src={review.customer.avatar} alt="" />
                        ) : (
                          <div className="provider-review-avatar provider-account-fallback">{review.customer?.initials || initials(customerName)}</div>
                        )}
                        <div className="provider-review-customer">
                          <strong>{customerName}</strong>
                          <small>{formatDate(review.createdAt)}</small>
                        </div>
                        <Stars rating={review.rating} />
                        <div className="provider-review-content">
                          <strong>{review.rating >= 5 ? "Excellent service" : review.rating >= 4 ? "Great experience" : review.rating >= 3 ? "Good experience" : "Customer feedback"}</strong>
                          <p>{review.comment || "No written feedback provided."}</p>
                        </div>
                        <span className="provider-review-service">{review.service?.title || "Service"}</span>
                        <button type="button" className="provider-review-more" aria-label="Review actions">⋮</button>
                      </article>
                    );
                  })}
                </div>
                <div className="provider-reviews-footer">
                  <span>Showing {filteredReviews.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filteredReviews.length)} of {filteredReviews.length} reviews</span>
                  <div>
                    <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>‹</button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5).map((number) => (
                      <button type="button" className={number === page ? "active" : ""} key={number} onClick={() => setPage(number)}>{number}</button>
                    ))}
                    <button type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>›</button>
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="provider-reviews-sidebar">
            <section className="provider-card provider-rating-breakdown">
              <h2>Rating breakdown</h2>
              <div className="provider-rating-bars">
                {(summary?.ratingBreakdown || [5,4,3,2,1].map((rating) => ({ rating, count: 0, percentage: 0 }))).map((item) => (
                  <div key={item.rating}>
                    <span>{item.rating} star{item.rating === 1 ? "" : "s"}</span>
                    <div><i style={{ width: item.percentage + "%" }} /></div>
                    <b>{item.count}</b>
                  </div>
                ))}
              </div>
              <div className="provider-positive-card">
                <Icon name="users" />
                <strong>{summary?.totalReviews ? Math.round((((summary.ratingBreakdown?.find((item) => item.rating === 5)?.count || 0) + (summary.ratingBreakdown?.find((item) => item.rating === 4)?.count || 0)) / summary.totalReviews) * 100) : 0}%</strong>
                <span>of reviews are 4 or 5 stars</span>
              </div>
            </section>

            <section className="provider-card provider-highlights">
              <h2>Recent highlights</h2>
              {highlights.length === 0 ? (
                <div className="provider-review-empty compact"><span>No written highlights yet.</span></div>
              ) : (
                <>
                  {highlights.map((review) => (
                    <div className="provider-highlight" key={review.id}>
                      <p>“{review.comment}”</p>
                      <span>{review.customer?.name || "Customer"}</span>
                    </div>
                  ))}
                  <button type="button" className="provider-outline-button">View all reviews →</button>
                </>
              )}
            </section>
          </aside>
        </div>
      </div>
    </ProviderShell>
  );
}
