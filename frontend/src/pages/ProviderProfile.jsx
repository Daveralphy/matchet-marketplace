import { useEffect, useMemo, useState } from "react";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderProfile } from "../api/provider";
import "../styles/provider-dashboard.css";

function formatMemberSince(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(new Date(value));
}

export default function ProviderProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProviderProfile()
      .then((response) => { if (active) setData(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load your profile."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const user = data?.user;
  const profile = data?.profile;
  const services = data?.services || [];
  const onboarding = profile?.onboarding || {};
  const categories = profile?.categories || [];
  const skills = profile?.skills || [];
  const location = profile?.serviceArea
    ? [profile.serviceArea.city, profile.serviceArea.country].filter(Boolean).join(", ")
    : [user?.location?.city, user?.location?.country].filter(Boolean).join(", ");
  const allTags = useMemo(() => [...new Set([...categories, ...skills])], [categories, skills]);

  if (loading) {
    return <ProviderShell><div className="provider-page provider-dashboard-loading"><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton large" /></div></ProviderShell>;
  }

  return (
    <ProviderShell>
      <div className="provider-page provider-profile-page">
        <div className="provider-heading">
          <div>
            <h1>Profile</h1>
            <span>Manage your public profile, personal details, and account information.</span>
          </div>
          <button type="button" className="provider-outline-button"><Icon name="eye" /> View public profile</button>
        </div>

        {error && <div className="provider-message-error" role="alert">{error}</div>}

        <div className="provider-profile-grid">
          <main>
            <section className="provider-card provider-profile-hero">
              <div className="provider-profile-photo">
                {user?.avatar ? <img src={user.avatar} alt="" /> : <div className="provider-profile-fallback">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>}
                <button type="button" aria-label="Change profile photo"><Icon name="camera" /></button>
              </div>
              <div>
                <h2>{user?.name || "Provider"}</h2>
                <p>{profile?.businessName || "Provider"}</p>
                <p><Icon name="location" /> {location || "Location not added"}</p>
                <p className="provider-bio">{profile?.bio || "Add a short bio to tell customers about your services."}</p>
                <div className="provider-chips">
                  {allTags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                  {allTags.length > 4 && <span>+{allTags.length - 4}</span>}
                </div>
              </div>
              <button type="button" className="provider-outline-button"><Icon name="edit" /> Edit profile</button>
            </section>

            <section className="provider-card provider-profile-about">
              <div className="provider-section-heading"><h2>About me</h2><button type="button" className="provider-outline-button"><Icon name="edit" /> Edit</button></div>
              <p className="provider-long-copy">{profile?.bio || "No bio has been added yet."}</p>
              <div className="provider-profile-details">
                <div><Icon name="location" /><span><strong>Location</strong><small>{location || "Not added"}</small></span></div>
                <div><Icon name="clock" /><span><strong>Response time</strong><small>{onboarding.providerResponseTime || "Not added"}</small></span></div>
                <div><Icon name="message" /><span><strong>Languages</strong><small>{user?.preferences?.languages?.join(", ") || "Not added"}</small></span></div>
                <div><Icon name="map" /><span><strong>Service areas</strong><small>{onboarding.providerServiceAreaSpecificLocations?.length ? onboarding.providerServiceAreaSpecificLocations.join(", ") : profile?.serviceArea ? [profile.serviceArea.city, profile.serviceArea.state, profile.serviceArea.country].filter(Boolean).join(", ") : "Not added"}</small></span></div>
                <div><Icon name="calendar" /><span><strong>Member since</strong><small>{formatMemberSince(user?.memberSince)}</small></span></div>
                <div><Icon name="shield" /><span><strong>Identity verification</strong><small>{profile?.verificationStatus || "Not verified"}</small></span></div>
              </div>
            </section>

            <section className="provider-card">
              <div className="provider-section-heading"><div><h2>Services</h2><p>Services currently attached to your provider account.</p></div></div>
              {services.length ? services.map((service) => (
                <div className="provider-profile-service" key={service._id}>
                  <span>{service.title}</span><b className={"status " + service.status}>{service.status}</b>
                </div>
              )) : <div className="provider-review-empty compact"><span>No services have been added yet.</span></div>}
            </section>
          </main>

          <aside className="provider-profile-sidebar">
            <section className="provider-card">
              <div className="provider-section-heading"><h2>Profile completeness</h2><strong>{data?.completeness?.percentage ?? 0}%</strong></div>
              <div className="provider-completeness-bar"><i style={{ width: (data?.completeness?.percentage ?? 0) + "%" }} /></div>
              <p>Keep your profile updated to get more bookings.</p>
              {(data?.completeness?.checks || []).map((check) => (
                <div className="provider-completeness-item" key={check.key}><span className={check.complete ? "complete" : ""}>{check.complete ? "✓" : ""}</span>{check.label}</div>
              ))}
              <div className="provider-completeness-item"><span className="optional"> </span>Add portfolio (optional)</div>
            </section>

            <section className="provider-card">
              <div className="provider-section-heading"><h2>Account information</h2><button type="button" className="provider-outline-button"><Icon name="edit" /> Edit</button></div>
              <div className="provider-account-row"><Icon name="message" /><span><strong>Email address</strong><small>{user?.email || "—"}</small></span></div>
              <div className="provider-account-row"><Icon name="user" /><span><strong>Phone number</strong><small>{user?.phone || "Not added"}</small></span></div>
              <div className="provider-account-row"><Icon name="settings" /><span><strong>Password</strong><small>••••••••</small></span><b>›</b></div>
              <div className="provider-account-row"><Icon name="bell" /><span><strong>Notification preferences</strong><small>Manage your email and in-app notifications</small></span><b>›</b></div>
            </section>

            <section className="provider-card provider-danger-card">
              <h2>Danger zone</h2>
              <div className="provider-account-row"><Icon name="trash" /><span><strong>Deactivate account</strong><small>Temporarily stop receiving new bookings</small></span><b>›</b></div>
            </section>
          </aside>
        </div>
      </div>
    </ProviderShell>
  );
}
