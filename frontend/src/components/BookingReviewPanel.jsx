import { useEffect, useState } from "react";
import { getBuyerBookingReview, submitBuyerBookingReview } from "../api/marketplace";

export default function BookingReviewPanel({ booking }) {
  const [data, setData] = useState({ review: null, eligible: false });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    getBuyerBookingReview(booking._id).then((result) => { if (active) setData({ review: result.review || null, eligible: Boolean(result.eligible) }); }).catch((e) => { if (active) setError(e.message || "Unable to load this review."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [booking._id]);
  async function submit() {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await submitBuyerBookingReview(booking._id, { rating, comment });
      setData((current) => ({ ...current, review: result.review || { rating, comment, createdAt: new Date().toISOString() } }));
      setOpen(false); setNotice("Your review has been published.");
    } catch (e) { setError(e.message || "Unable to submit your review."); }
    finally { setBusy(false); }
  }
  return <section className="mt-3 rounded-xl border border-[#e2e7ed] bg-[#fafbfd] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><strong className="text-sm text-[#10183f]">Rate this service</strong><p className="mt-1 text-xs text-[#69739a]">{data.eligible ? "Your booking is complete. Share your experience." : "You can review this service after the booking is marked completed."}</p></div>{!loading && data.review ? <span className="text-xs font-semibold text-[#087d35]">✓ Reviewed · {data.review.rating}/5</span> : data.eligible && <button type="button" onClick={() => { setOpen((v) => !v); setError(""); }} className="rounded-lg border border-[#087d35] px-3 py-2 text-xs font-semibold text-[#087d35]">{open ? "Close" : "Write a review"}</button>}</div>
    {data.review && <p className="mt-3 text-sm leading-6 text-[#48516c]">{data.review.comment || "You left a rating without written feedback."}</p>}
    {open && !data.review && <div className="mt-3 border-t border-[#e8edf2] pt-3"><label className="block text-xs font-semibold text-[#10183f]">Your rating</label><div className="mt-1 flex gap-1" role="radiogroup" aria-label="Rating">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={value+" star"+(value===1?"":"s")} aria-pressed={rating===value} className={"text-2xl "+(value<=rating?"text-[#f5a900]":"text-[#d7dce3]")}>★</button>)}</div><label className="mt-3 block text-xs font-semibold text-[#10183f]">Written feedback (optional)</label><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} rows={3} placeholder="How was your experience with this provider?" className="mt-1 w-full rounded-lg border border-[#dce2e9] p-3 text-base outline-none focus:border-[#087d35] sm:text-sm"/><div className="mt-3 flex justify-end"><button type="button" disabled={busy} onClick={submit} className="rounded-lg bg-[#087d35] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">{busy ? "Submitting..." : "Submit review"}</button></div></div>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="mt-3 text-sm text-[#087d35]">{notice}</p>}
  </section>;
}
