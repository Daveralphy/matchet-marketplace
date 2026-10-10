import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderSettings, updateProviderSettingsPreferences } from "../api/provider";
import "../styles/provider-dashboard.css";

const tabs = [
  { id: "account", label: "Account", icon: "user" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "payments", label: "Payments", icon: "wallet" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "privacy", label: "Privacy", icon: "lock" },
  { id: "platform", label: "Platform", icon: "settings" },
];

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function SettingRow({ icon, title, description, value, action, href, danger = false }) {
  return (
    <div className={"provider-settings-row" + (danger ? " danger" : "")}>
      <div className="provider-settings-row-icon"><Icon name={icon} /></div>
      <div className="provider-settings-row-copy"><strong>{title}</strong><small>{description}</small></div>
      {value !== undefined && <div className="provider-settings-value">{value}</div>}
      {action && href && <Link to={href} className={danger ? "provider-danger-button" : "provider-outline-button"}>{action}</Link>}{action && !href && <span className="provider-settings-value">{action}</span>}
    </div>
  );
}

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="provider-settings-row">
      <div className="provider-settings-row-copy"><strong>{label}</strong><small>{description}</small></div>
      <button type="button" className={"provider-toggle " + (enabled ? "on" : "")} onClick={onChange} aria-pressed={enabled}>
        <span />
      </button>
    </div>
  );
}

function EmptyState({ title, description }) {
  return <div className="provider-settings-empty"><Icon name="settings" size={28} /><strong>{title}</strong><p>{description}</p></div>;
}

export default function ProviderSettings() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(["account", "notifications", "payments", "security", "privacy", "platform"].includes(requestedTab) ? requestedTab : "account");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localNotifications, setLocalNotifications] = useState({});
  const [localPrivacy, setLocalPrivacy] = useState({});
  const [localPlatform, setLocalPlatform] = useState({});
  const [savingKey, setSavingKey] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;
    getProviderSettings()
      .then((response) => {
        if (!active) return;
        const next = response.data;
        setData(next);
        setLocalNotifications(next.notifications || {});
        setLocalPrivacy(next.privacy || {});
        setLocalPlatform(next.platform || {});
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load your settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const updatePreference = async (section, key) => {
    const setters = { notifications: setLocalNotifications, privacy: setLocalPrivacy, platform: setLocalPlatform };
    const current = section === "notifications" ? localNotifications : section === "privacy" ? localPrivacy : localPlatform;
    const next = { ...current, [key]: !current[key] };
    setters[section](next);
    setSavingKey(section + ":" + key);
    setSaveMessage("");
    try {
      await updateProviderSettingsPreferences({ [section]: { [key]: next[key] } });
      setSaveMessage("Preference saved.");
    } catch (requestError) {
      setters[section](current);
      setSaveMessage(requestError.message || "Unable to save this preference.");
    } finally {
      setSavingKey("");
    }
  };

  const account = data?.account;
  const payments = data?.payments;
  const security = data?.security;

  const notificationEntries = useMemo(() => Object.entries(localNotifications), [localNotifications]);
  const privacyEntries = useMemo(() => Object.entries(localPrivacy), [localPrivacy]);
  const platformEntries = useMemo(() => Object.entries(localPlatform), [localPlatform]);

  if (loading) {
    return <ProviderShell><div className="provider-page provider-dashboard-loading"><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton large" /></div></ProviderShell>;
  }

  return (
    <ProviderShell>
      <div className="provider-page provider-settings-page">
        <div className="provider-heading">
          <div>
            <h1>Settings</h1>
            <span>Manage your account, preferences, and platform settings.</span>
          </div>
        </div>

        {error && <div className="provider-message-error">{error}</div>}

        {saveMessage && <div className="provider-settings-save-message">{saveMessage}</div>}

        <div className="provider-settings-tabs">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
              <Icon name={tab.icon} /><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "account" && (
          <div className="provider-settings-layout">
            <section className="provider-card provider-settings-card">
              <div className="provider-settings-card-heading"><h2>Account settings</h2><p>Manage your basic account information and login preferences.</p></div>
              <SettingRow icon="message" title="Email address" description="Used for login and important notifications" value={account?.email || "Not configured"} action="View account settings" href="/account/settings" />
              <SettingRow icon="user" title="Phone number" description="Used for account verification and alerts" value={account?.phone || "Not configured"} action="View account settings" href="/account/settings" />
              <SettingRow icon="settings" title="Password" description="Keep your account secure" value="••••••••" action="Security settings" href="/account/security" />
              <SettingRow icon="settings" title="Language" description="Choose your preferred language" value={data?.platform?.language || "Not configured"} />
              <SettingRow icon="user" title="Account status" description={account?.isActive ? "Your account is active" : "Your account is inactive"} value={account?.isActive ? "Active" : "Inactive"} />
              <SettingRow icon="shield" title="Provider application" description="Current provider verification state" value={data?.application?.verificationStatus || "Not submitted"} />
              <SettingRow icon="clock" title="Response time" description="Response time supplied during provider onboarding" value={data?.onboarding?.providerResponseTime || "Not provided"} />
              <SettingRow icon="calendar" title="Minimum booking notice" description="Advance notice supplied during provider onboarding" value={data?.onboarding?.providerMinimumNoticeRequired || "Not provided"} />
              <SettingRow icon="calendar" title="Maximum advance booking" description="Booking window supplied during provider onboarding" value={data?.onboarding?.providerMaximumAdvanceBooking || "Not provided"} />
              <SettingRow icon="settings" title="Delete account" description="Permanently delete your account and all associated data" action="Delete account" href="/account/delete" danger />
            </section>
            <aside className="provider-settings-side">
              <section className="provider-card"><h2>Quick actions</h2><SettingRow icon="settings" title="Change password" description="Update your password" action="Open security settings" href="/account/security" /><SettingRow icon="user" title="Manage devices" description="Device management is not available yet." /><SettingRow icon="settings" title="Sign out" description="Use the account menu to sign out securely." /></section>
              <section className="provider-card provider-settings-help"><h2>Need help?</h2><p>If you have questions about your account settings, our support team is here to help.</p><Link to="/contact?subject=Provider%20account%20support" className="provider-outline-button">Contact support&nbsp; →</Link></section>
            </aside>
          </div>
        )}

        {activeTab === "notifications" && (
          <section className="provider-card provider-settings-card">
            <div className="provider-settings-card-heading"><h2>Notification preferences</h2><p>Control how Matchet keeps you informed about your provider activity.</p></div>
            {notificationEntries.length ? notificationEntries.map(([key, value]) => (
              <ToggleRow key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} description="Preference saved on your account" enabled={Boolean(value)} onChange={() => updatePreference("notifications", key)} />
            )) : <EmptyState title="No notification preferences configured" description="Your notification preferences will appear here once they are saved to your account." />}
          </section>
        )}

        {activeTab === "payments" && (
          <section className="provider-card provider-settings-card">
            <div className="provider-settings-card-heading"><h2>Payment settings</h2><p>Review the payout method associated with your provider account.</p></div>
            {payments?.method?.bankName ? (
              <>
                <SettingRow icon="wallet" title={payments.method.bankName} description="Payout account" value={payments.method.accountLast4 ? "•••• " + payments.method.accountLast4 : "Account number not available"} action="Payout editing unavailable" />
                <SettingRow icon="wallet" title="Latest payout status" description="Status of your most recent payout record" value={payments.payoutStatus || "Not available"} />
              </>
            ) : <EmptyState title="No payout method configured" description="Your payout method will appear here once payout information has been saved." />}
          </section>
        )}

        {activeTab === "security" && (
          <section className="provider-card provider-settings-card">
            <div className="provider-settings-card-heading"><h2>Security</h2><p>Review the security state of your account and provider verification.</p></div>
            <SettingRow icon="shield" title="Identity verification" description="Provider verification status" value={security?.identityVerification || "Not verified"} />
            <SettingRow icon="shield" title="Provider account status" description="Current provider profile status" value={security?.providerStatus || "Not available"} />
            <SettingRow icon="settings" title="Last sign in" description="Most recent successful account login" value={formatDate(security?.lastLoginAt)} />
            <SettingRow icon="settings" title="Password" description="Your password is stored securely and never displayed" action="Change password" href="/account/security" />
          </section>
        )}

        {activeTab === "privacy" && (
          <section className="provider-card provider-settings-card">
            <div className="provider-settings-card-heading"><h2>Privacy</h2><p>Control privacy preferences stored with your Matchet account.</p></div>
            {privacyEntries.length ? privacyEntries.map(([key, value]) => (
              <ToggleRow key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} description="Preference saved on your account" enabled={Boolean(value)} onChange={() => updatePreference("privacy", key)} />
            )) : <EmptyState title="No privacy preferences configured" description="Privacy controls will appear here when they are available for your account." />}
          </section>
        )}

        {activeTab === "platform" && (
          <section className="provider-card provider-settings-card">
            <div className="provider-settings-card-heading"><h2>Platform settings</h2><p>Manage platform preferences associated with your account.</p></div>
            {platformEntries.length ? platformEntries.map(([key, value]) => (
              <div className="provider-settings-row" key={key}>
                <div className="provider-settings-row-icon"><Icon name="settings" /></div>
                <div className="provider-settings-row-copy"><strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</strong><small>Preference saved on your account</small></div>
                <div className="provider-settings-value">{String(value)}</div>
              </div>
            )) : <EmptyState title="No platform preferences configured" description="Platform preferences will appear here when they are saved to your account." />}
          </section>
        )}
      </div>
    </ProviderShell>
  );
}
