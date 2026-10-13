import { useEffect, useState } from "react";
import { getListingReviews } from "../api/marketplace";

export default function ListingReviews({ kind, listingId }) {
  const [data, setData] = useState({ summary: { averageRating: 0, totalReviews: 0 }, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    getListingReviews(kind, listingId)
      .then((result) => { if (active) setData({ summary: result.summary || { averageRating: 0, totalReviews: 0 }, reviews: result.reviews || [] }); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load reviews."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, listingId]);
  return <section className="mt-8 border-t border-[#e1e6ec] pt-7">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#10183f]">Ratings and reviews</h2><p className="mt-1 text-[13px] text-[#69739a]">Feedback from customers who have reviewed this listing.</p></div><div className="text-right"><strong className="text-xl text-[#10183f]">{data.summary.totalReviews ? data.summary.averageRating.toFixed(1) : "—"}</strong><span className="ml-2 text-[#f5a900]">★★★★★</span><p className="text-xs text-[#69739a]">{data.summary.totalReviews} {data.summary.totalReviews === 1 ? "review" : "reviews"}</p></div></div>
    {loading ? <p className="mt-5 rounded-xl bg-white p-5 text-sm text-[#69739a]">Loading reviews...</p> : error ? <div className="mt-5 rounded-xl border border-[#f0d6d6] bg-white p-5 text-sm text-[#9b3434]" role="alert">{error}</div> : data.reviews.length ? <div className="mt-5 space-y-3">{data.reviews.map((review) => <article key={review.id} className="rounded-xl border border-[#e4e8ee] bg-white p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{review.customer?.avatar ? <img src={review.customer.avatar} alt="" className="h-10 w-10 rounded-full object-cover"/> : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5ed] text-sm font-semibold text-[#087d35]">{(review.customer?.name || "C").split(/\s+/).map((part) => part[0]).join("").slice(0,2).toUpperCase()}</span>}<div><strong className="text-sm text-[#10183f]">{review.customer?.name || "Customer"}</strong><p className="mt-0.5 text-xs text-[#69739a]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}</p></div></div><span className="whitespace-nowrap text-sm text-[#f5a900]" aria-label={review.rating + " out of 5 stars"}>{"★".repeat(review.rating)}<span className="text-[#d7dce3]">{"★".repeat(5-review.rating)}</span></span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#48516c]">{review.comment || "No written feedback provided."}</p></article>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-[#d9dfe7] bg-white px-5 py-9 text-center"><div className="text-2xl text-[#c5cbd5]">☆</div><strong className="mt-2 block text-sm text-[#10183f]">No reviews yet</strong><p className="mt-1 text-sm text-[#69739a]">Be the first customer to share feedback after your purchase or completed booking.</p></div>}
  </section>;
}
