import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateCurrentUser } from "../api/auth";
import { applyAppearance } from "../utils/uiPreferences";
import "./BuyerAccount.css";
export default function AccountAppearance() {
  const { user, refreshUser } = useAuth();
  const [theme, setTheme] = useState(user?.preferences?.appearance?.theme || "system");
  const [textSize, setTextSize] = useState(user?.preferences?.appearance?.textSize || "medium");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { const next = user?.preferences?.appearance || {}; setTheme(next.theme || "system"); setTextSize(next.textSize || "medium"); }, [user]);
  useEffect(() => { applyAppearance({ theme, textSize }); }, [theme, textSize]);
  async function save(event) {
    event.preventDefault(); setSaving(true); setMessage(""); const appearance = { theme, textSize };
    try { await updateCurrentUser({ preferences: { ...(user?.preferences || {}), appearance } }); localStorage.setItem("matchet_appearance", JSON.stringify(appearance)); applyAppearance(appearance); await refreshUser(); setMessage("Appearance preferences saved."); }
    catch (error) { setMessage(error.message || "Unable to save appearance."); } finally { setSaving(false); }
  }
  return <main className="buyer-account-page"><div className="buyer-account-container">
    <div className="buyer-breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/account/settings">Account Settings</Link><span>›</span><span>Appearance</span></div>
    <header><h1>Appearance</h1><p>Adjust the interface to suit your viewing preference.</p></header>
    <section className="settings-card"><form onSubmit={save} className="space-y-6">
      <fieldset><legend className="mb-3 text-sm font-semibold text-[#10183f]">Theme</legend><div className="grid gap-3 sm:grid-cols-3">{[["light","Light","Bright background"],["dark","Dark","Low-light interface"],["system","System","Follow your device"]].map(([value,title,description])=><label key={value} className={"cursor-pointer rounded-xl border p-4 " + (theme===value ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200")}><input className="mr-2" type="radio" name="theme" value={value} checked={theme===value} onChange={()=>setTheme(value)}/><span className="text-sm font-semibold text-[#10183f]">{title}</span><span className="mt-2 block text-xs text-slate-500">{description}</span></label>)}</div></fieldset>
      <fieldset><legend className="mb-3 text-sm font-semibold text-[#10183f]">Text size</legend><div className="flex flex-wrap gap-3">{[["small","Small"],["medium","Medium"],["large","Large"]].map(([value,title])=><label key={value} className={"flex items-center gap-2 rounded-lg border px-4 py-3 text-sm " + (textSize===value ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200")}><input type="radio" name="textSize" value={value} checked={textSize===value} onChange={()=>setTextSize(value)}/>{title}</label>)}</div></fieldset>
      <div className="rounded-xl border border-slate-200 p-4"><p className="text-sm font-semibold text-[#10183f]">Preview</p><p className="mt-2 text-sm text-slate-600">This is how your selected text size will feel across the interface.</p></div>
      <div className="settings-actions"><button type="submit" disabled={saving}>{saving ? "Saving..." : "Save appearance"}</button>{message && <span role="status">{message}</span>}</div>
    </form></section>
  </div></main>;
}
