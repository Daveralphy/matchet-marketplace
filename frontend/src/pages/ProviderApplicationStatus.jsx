import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProviderShell, Icon } from "../components/ProviderShell";
import { getProviderProfile } from "../api/provider";
import "../styles/provider-dashboard.css";

export default function ProviderApplicationStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProviderProfile().then((response) => {
      if (active) setData(response.data);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  if (loading) return <ProviderShell><div className="provider-page provider-dashboard-loading"><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton large" /></div></ProviderShell>;

  const application = data?.profile;
  const submitted = application?.applicationSubmittedAt;
  const verification = application?.verificationStatus || "pending";
  const status = application?.status || "draft";
  const rejected = verification === "rejected";
  const approved = verification === "verified";

  return (
    <ProviderShell>
      <div className="provider-page provider-application-page">
        <div className="provider-heading">
          <div><h1>Application status</h1><span>Track the review status of your provider application.</span></div>
          <Link to="/provider/dashboard" className="provider-outline-button">← Back to dashboard</Link>
        </div>

        <section className={"provider-card provider-application-hero " + (approved ? "approved" : rejected ? "rejected" : "pending")}>
          <div className="provider-application-icon"><Icon name={approved ? "shield" : rejected ? "bell" : "clock"} size={30} /></div>
          <div>
            <strong>{approved ? "Application approved" : rejected ? "Application needs attention" : "Application is under review"}</strong>
            <p>{approved ? "Your provider profile has been approved and can proceed to provider activity." : rejected ? (application.reviewNote || "Please review the feedback and update your application.") : "Your application has been received. An administrator can review the information you submitted before activating your provider profile."}</p>
          </div>
        </section>

        <section className="provider-card">
          <h2>Application details</h2>
          <div className="provider-application-details">
            <div><span>Status</span><strong>{status}</strong></div>
            <div><span>Verification</span><strong>{verification}</strong></div>
            <div><span>Submitted</span><strong>{submitted ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(submitted)) : "Not submitted"}</strong></div>
            <div><span>Business / provider name</span><strong>{application?.businessName || data?.user?.name || "Provider"}</strong></div>
          </div>
        </section>

        <section className="provider-card">
          <h2>What happens next?</h2>
          <div className="provider-application-steps">
            <div className="done"><span>1</span><strong>Application submitted</strong><small>Your onboarding information is stored with your provider profile.</small></div>
            <div className={approved || rejected ? "done" : "current"}><span>2</span><strong>Application review</strong><small>An administrator can review your provider information and verification details.</small></div>
            <div className={approved ? "done" : ""}><span>3</span><strong>Provider activation</strong><small>Once approved, your provider profile can become active.</small></div>
          </div>
        </section>
      </div>
    </ProviderShell>
  );
}
