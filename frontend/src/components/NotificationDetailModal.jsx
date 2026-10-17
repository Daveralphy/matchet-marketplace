import { useEffect } from "react";

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

export function notificationDestination(notification, mode = "customer") {
  const type = String(notification?.type || "").toUpperCase();
  const id = notification?.relatedId ? String(notification.relatedId) : "";
  if (type === "NEW_MESSAGE" || notification?.relatedType === "message") {
    if (mode === "seller") return "/seller/messages";
    if (mode === "provider") return "/provider/messages";
    if (mode === "admin") return "/admin/dashboard";
    return "/messages";
  }
  if (notification?.relatedType === "order" || type.startsWith("ORDER_") || type === "PAYMENT_SUCCESS") {
    if (!id) return mode === "seller" ? "/seller/orders" : "/orders";
    if (mode === "seller") return "/seller/orders/" + encodeURIComponent(id);
    if (mode === "provider") return "/provider/dashboard";
    return "/orders/" + encodeURIComponent(id);
  }
  if (notification?.relatedType === "booking" || type.startsWith("BOOKING_")) {
    if (!id) return mode === "provider" ? "/provider/bookings" : "/bookings";
    return mode === "provider" ? "/provider/bookings" : "/bookings";
  }
  if (type === "NEW_REVIEW") return mode === "seller" ? "/seller/reviews" : mode === "provider" ? "/provider/reviews" : "/orders";
  if (type.includes("SELLER_APPLICATION")) return "/seller/dashboard";
  if (type.includes("PROVIDER_APPLICATION")) return "/provider/dashboard";
  return "/account";
}

export default function NotificationDetailModal({ notification, onClose, onOpenTarget, mode = "customer" }) {
  useEffect(() => {
    if (!notification) return undefined;
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notification, onClose]);
  if (!notification) return null;
  const destination = typeof notification.actionUrl === "string" && notification.actionUrl.startsWith("/") && !notification.actionUrl.startsWith("//") ? notification.actionUrl : notificationDestination(notification, mode);
  const type = String(notification.type || "").toUpperCase();
  const icon = type === "NEW_MESSAGE" ? "✉" : type.startsWith("ORDER_") || type === "PAYMENT_SUCCESS" ? "▣" : type.startsWith("BOOKING_") ? "◷" : type === "NEW_REVIEW" ? "★" : "♧";
  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#10183f]/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="notification-detail-title">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f5ed] text-xl text-[#07863a]">{icon}</span><div><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#07863a]">Matchet notification</p><h2 id="notification-detail-title" className="mt-1 text-lg font-bold text-[#10183f]">{notification.title || "Notification"}</h2></div></div><button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100" aria-label="Close notification">×</button></div>
      <div className="px-5 py-5"><p className="whitespace-pre-wrap text-sm leading-6 text-[#4d5670]">{notification.message || "You have an update on Matchet."}</p><div className="mt-4 flex items-center justify-between gap-3"><p className="text-xs text-slate-400">{dateLabel(notification.createdAt)}</p><span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold " + (notification.read ? "bg-slate-100 text-slate-500" : "bg-[#e8f5ed] text-[#07863a]")}>{notification.read ? "Read" : "Unread"}</span></div>{notification.details && Object.keys(notification.details).length > 0 && <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">{Object.entries(notification.details).filter(([key, value]) => typeof value !== "object" && value !== null && String(value).trim()).slice(0, 8).map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-xs"><dt className="capitalize text-slate-400">{key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}</dt><dd className="text-right font-medium text-[#10183f]">{String(value)}</dd></div>)}</dl>}<div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#10183f]">Close</button><button type="button" onClick={() => onOpenTarget(destination)} className="rounded-lg bg-[#07863a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#066f30]">Open details <span aria-hidden="true">→</span></button></div></div>
    </section>
  </div>;
}
