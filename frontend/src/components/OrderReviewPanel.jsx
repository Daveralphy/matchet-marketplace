import { useEffect, useState } from "react";
import { getBuyerOrderReviews, submitBuyerOrderReview } from "../api/marketplace";

export default function OrderReviewPanel({ order }) {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const eligible = order?.paymentStatus === "paid" && order?.orderStatus === "delivered";
  useEffect(() => {
    let active = true;
    getBuyerOrderReviews(order._id).then((items) => { if (active) setReviews(items); }).catch(() => {});
    return () => { active = false; };
  }, [order._id]);
  const reviewed = new Set(reviews.map((item) => String(item.productId)));
  async function submit(productId) {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await submitBuyerOrderReview(order._id, { productId, rating, comment });
      setReviews((items) => [...items, result.review]);
      setComment(""); setOpen(false);
      setNotice("Your review has been published.");
    } catch (requestError) { setError(requestError.message || "Unable to submit your review."); }
    finally { setBusy(false); }
  }
  return <section className="mt-4 rounded-xl border border-[#e2e7ed] bg-[#fafbfd] p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><strong className="text-sm text-[#10183f]">Rate your purchase</strong><p className="mt-1 text-xs text-[#69739a]">{eligible ? "Share feedback for each product in this delivered order." : "Reviews become available after payment is confirmed and the order is delivered."}</p></div>{eligible && <span className="rounded-full bg-[#e7f8ec] px-3 py-1 text-xs font-semibold text-[#087d35]">Eligible to review</span>}</div>
    {eligible && <div className="mt-3 space-y-3">{(order.items || []).map((item) => { const id = String(item.productId?._id || item.productId); const existing = reviewed.has(id); return <div key={id} className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8edf2] pt-3"><span className="text-sm font-medium text-[#10183f]">{item.nameSnapshot || item.productId?.name || "Product"}</span>{existing ? <span className="text-xs font-semibold text-[#087d35]">✓ Reviewed</span> : <button type="button" onClick={() => { setOpen(id); setRating(5); setComment(""); setError(""); }} className="rounded-lg border border-[#087d35] px-3 py-2 text-xs font-semibold text-[#087d35]">Write a review</button>}{open === id && <div className="basis-full rounded-lg border border-[#e2e7ed] bg-white p-3"><label className="block text-xs font-semibold text-[#10183f]">Your rating</label><div className="mt-1 flex gap-1" role="radiogroup" aria-label="Rating">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={value+" star"+(value===1?"":"s")} aria-pressed={rating===value} className={"text-2xl "+(value<=rating?"text-[#f5a900]":"text-[#d7dce3]")}>★</button>)}</div><label className="mt-3 block text-xs font-semibold text-[#10183f]">Written feedback (optional)</label><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} rows={3} placeholder="What was your experience with this product?" className="mt-1 w-full rounded-lg border border-[#dce2e9] p-3 text-base outline-none focus:border-[#087d35] sm:text-sm"/><div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-[#dce2e9] px-3 py-2 text-xs">Cancel</button><button type="button" disabled={busy} onClick={() => submit(id)} className="rounded-lg bg-[#087d35] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">{busy?"Submitting...":"Submit review"}</button></div></div>}</div>})}</div>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="mt-3 text-sm text-[#087d35]">{notice}</p>}
  </section>;
}
