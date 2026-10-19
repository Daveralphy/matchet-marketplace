import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/account/account.css";
import { translate } from "../utils/uiPreferences";

const settings = [
  { title: "Notification preferences", description: "Choose which updates reach you by email and browser push.", path: "/account/settings/notifications", mark: "↗" },
  { title: "Language", description: "Choose the language for the Matchet interface.", path: "/account/settings/language", mark: "文" },
  { title: "Appearance", description: "Adjust theme and text size for comfortable viewing.", path: "/account/settings/appearance", mark: "◐" },
  { title: "Deactivate account", description: "Review account closure requirements and deactivate your account.", path: "/account/delete", mark: "×", danger: true },
];

export default function AccountSettings() {
  const { user } = useAuth();
  const language = user?.preferences?.language || "English";
  return (
    <main className="buyer-account-page">
      <div className="buyer-account-container">
        <div className="buyer-breadcrumb"><Link to="/">Home</Link><span>›</span><span>Account Settings</span></div>
        <header><h1>{translate("Account Settings", language)}</h1><p>{translate("Manage the way Matchet works for you.", language)}</p></header>
        <section className="settings-card">
          <div className="divide-y divide-slate-100">
            {settings.map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center gap-4 py-5 first:pt-1 last:pb-1">
                <span className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg " + (item.danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700")}>{item.mark}</span>
                <span className="min-w-0 flex-1"><span className={"block text-sm font-semibold " + (item.danger ? "text-red-600" : "text-[#10183f]")}>{translate(item.title, language)}</span><span className="mt-1 block text-sm leading-5 text-slate-500">{translate(item.description, language)}</span></span>
                <span aria-hidden="true" className="text-slate-400">→</span>
              </Link>
            ))}
          </div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">{translate("Signed in as", language)} {user?.email || "your Matchet account"}.</p>
        </section>
      </div>
    </main>
  );
}
