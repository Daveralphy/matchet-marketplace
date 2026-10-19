import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateCurrentUser } from "../api/auth";
import "../styles/account/account.css";
const API_BASE_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const CATEGORIES = [
  ["order", "Orders", "Order creation, fulfilment and delivery updates."],
  ["booking", "Bookings", "Booking confirmations, changes and completion."],
  ["payment", "Payments", "Payment confirmations and payment status."],
  ["application", "Seller/provider applications", "Application review and decisions."],
  ["message", "Messages", "New message alerts. Optional email alerts can be unsubscribed."],
  ["recommendation", "Recommendations", "Personalized product and service suggestions."],
  ["security", "Security", "Sign-in and account security alerts."],
];
const REQUIRED_EMAIL = ["order", "booking", "payment", "application", "security"];
function defaultPreferences(user) {
  const saved = user?.preferences?.notifications || {};
  const defaults = { order: true, booking: true, payment: true, application: true, message: true, recommendation: true, security: true };
  const email = { ...defaults, ...(saved.email || {}) };
  REQUIRED_EMAIL.forEach((key) => { email[key] = true; });
  return { email, push: { ...defaults, ...(saved.push || {}) } };
}
function base64ToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}
export default function AccountNotificationPreferences() {
  const { user, refreshUser } = useAuth();
  const [preferences, setPreferences] = useState(() => defaultPreferences(user));
  const [saving, setSaving] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushConfigured, setPushConfigured] = useState(false);
  const [pushPermission, setPushPermission] = useState(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  const [msg, setMsg] = useState("");
  useEffect(() => { setPreferences(defaultPreferences(user)); }, [user]);
  useEffect(() => { fetch(API_BASE_URL + "/api/notifications/push-key", { credentials: "include" }).then((response) => response.json()).then((payload) => setPushConfigured(Boolean(payload.configured && payload.publicKey))).catch(() => setPushConfigured(false)); }, []);
  const setPreference = (channel, category, value) => setPreferences((current) => ({ ...current, [channel]: { ...current[channel], [category]: value } }));
  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const response = await fetch(API_BASE_URL + "/api/notifications/preferences", { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notifications: preferences }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to save notification preferences.");
      await updateCurrentUser({ preferences: { ...(user?.preferences || {}), notifications: payload.data || preferences } });
      await refreshUser(); setMsg("Your notification preferences have been saved.");
    } catch (error) { setMsg(error.message || "Unable to save settings."); } finally { setSaving(false); }
  };
  const enablePush = async () => {
    setPushBusy(true); setMsg("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("This browser does not support web push notifications.");
      const keyResponse = await fetch(API_BASE_URL + "/api/notifications/push-key", { credentials: "include" });
      const keyPayload = await keyResponse.json();
      if (!keyResponse.ok || !keyPayload.publicKey) throw new Error(keyPayload.message || "Browser push has not been configured on Matchet's server yet.");
      const permission = await Notification.requestPermission(); setPushPermission(permission);
      if (permission !== "granted") throw new Error("Allow notifications in your browser settings to enable push alerts.");
      const registration = await navigator.serviceWorker.register("/sw.js");
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToBytes(keyPayload.publicKey) });
      const response = await fetch(API_BASE_URL + "/api/notifications/push-subscriptions", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: subscription.toJSON() }) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.message || "Unable to save this browser subscription.");
      setMsg("Push notifications are enabled for this browser.");
    } catch (error) { setMsg(error.message || "Unable to enable push notifications."); } finally { setPushBusy(false); }
  };
  return <main className="buyer-account-page"><div className="buyer-account-container">
    <div className="buyer-breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/account/settings">Account Settings</Link><span>›</span><span>Notification preferences</span></div>
    <header><h1>Notification preferences</h1><p>Choose which optional updates can reach you. Essential security and transaction emails stay enabled.</p></header>
    <section className="settings-card">
      <div className="mb-5 rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-[#10183f]">Browser push</h2><p className="mt-1 text-sm text-slate-500">{pushPermission === "granted" ? "Browser permission is granted." : pushPermission === "denied" ? "Browser permission is blocked. Change it in your browser site settings." : "Get timely alerts even when Matchet is not the active tab."}</p></div><button type="button" onClick={enablePush} disabled={pushBusy || !pushConfigured || pushPermission === "denied"} className="rounded-lg bg-[#07863a] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{pushBusy ? "Enabling…" : pushConfigured ? "Enable push" : "Push not configured"}</button></div>{!pushConfigured && <p className="mt-2 text-xs text-amber-700">Browser push is not configured on the server yet. It will be available after the staging backend is configured and redeployed.</p>}</div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="py-3 pr-4 font-semibold">Category</th><th className="px-3 py-3 text-center font-semibold">Email</th><th className="px-3 py-3 text-center font-semibold">Browser push</th></tr></thead><tbody>{CATEGORIES.map(([key,title,description]) => <tr key={key} className="border-b border-slate-100 last:border-0"><td className="py-4 pr-4"><p className="text-sm font-semibold text-[#10183f]">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>{REQUIRED_EMAIL.includes(key) && <p className="mt-1 text-[11px] text-slate-400">Essential transactional email cannot be turned off.</p>}</td><td className="px-3 py-4 text-center"><input aria-label={title + " email notifications"} type="checkbox" checked={REQUIRED_EMAIL.includes(key) || preferences.email[key] !== false} disabled={REQUIRED_EMAIL.includes(key)} onChange={(event) => setPreference("email",key,event.target.checked)} /></td><td className="px-3 py-4 text-center"><input aria-label={title + " push notifications"} type="checkbox" checked={preferences.push[key] !== false} onChange={(event) => setPreference("push",key,event.target.checked)} /></td></tr>)}</tbody></table></div>
      <div className="settings-actions"><button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save preferences"}</button>{msg && <span role="status">{msg}</span>}</div>
    </section>
  </div></main>;
}
