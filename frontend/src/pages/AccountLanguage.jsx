import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateCurrentUser } from "../api/auth";
import { applyLanguage, SUPPORTED_LANGUAGES } from "../utils/uiPreferences";
import "./BuyerAccount.css";
export default function AccountLanguage() {
  const { user, refreshUser } = useAuth();
  const [language, setLanguage] = useState(user?.preferences?.language || "English");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => setLanguage(user?.preferences?.language || "English"), [user]);
  async function save(event) {
    event.preventDefault(); setSaving(true); setMessage("");
    try { await updateCurrentUser({ preferences: { ...(user?.preferences || {}), language } }); applyLanguage(language); await refreshUser(); setMessage("Language preference saved."); }
    catch (error) { setMessage(error.message || "Unable to save language."); } finally { setSaving(false); }
  }
  return <main className="buyer-account-page"><div className="buyer-account-container">
    <div className="buyer-breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/account/settings">Account Settings</Link><span>›</span><span>Language</span></div>
    <header><h1>Language</h1><p>Choose the language used for Matchet's navigation and account settings.</p></header>
    <section className="settings-card"><form onSubmit={save} className="space-y-5">
      <label className="block"><span className="mb-2 block text-sm font-semibold text-[#10183f]">Display language</span><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm" value={language} onChange={(event) => setLanguage(event.target.value)}>{SUPPORTED_LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><small className="mt-2 block text-xs leading-5 text-slate-500">Your choice is saved to your account and applied to supported interface labels. Seller-written listing descriptions remain in their original language.</small></label>
      <div className="settings-actions"><button type="submit" disabled={saving}>{saving ? "Saving..." : "Save language"}</button>{message && <span role="status">{message}</span>}</div>
    </form></section>
  </div></main>;
}
