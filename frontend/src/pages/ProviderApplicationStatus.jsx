import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProviderProfile } from "../api/provider";
import "../styles/provider-dashboard.css";

export default function ProviderApplicationStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshUser } = useAuth();

  const loadStatus = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await getProviderProfile();
      setData(response.data);
      if (response.data?.profile?.verificationStatus === "verified") await refreshUser();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  if (loading) {
    return (
      <main className="provider-application-status-standalone">
        <div className="provider-application-status-card">
          <div className="provider-dashboard-skeleton" />
          <div className="provider-dashboard-skeleton large" />
        </div>
      </main>
    );
  }

  const application = data?.profile;
  const verification = application?.verificationStatus || "pending";
  const approved = verification === "verified";
  const rejected = verification === "rejected";

  if (approved) {
    return (
      <main className="provider-application-status-standalone">
        <div className="provider-application-status-card">
          <div className="provider-status-mark provider-status-mark-success">✓</div>
          <h1>Application approved</h1>
          <p>Your provider application has been approved. Your provider dashboard is now available.</p>
          <div className="provider-application-status-actions">
            <Link to="/provider/dashboard" className="provider-status-primary">Go to provider dashboard</Link>
            <Link to="/" className="provider-status-secondary">Return to Matchet</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="provider-application-status-standalone">
      <div className="provider-application-status-card">
        <div className={"provider-status-mark " + (rejected ? "provider-status-mark-rejected" : "provider-status-mark-pending")}>
          {rejected ? "!" : "✓"}
        </div>

        <h1>{rejected ? "Application needs attention" : "Your application is under review"}</h1>

        <p className="provider-status-lead">
          {rejected
            ? (application?.reviewNote || "Your application was not approved. Please review the feedback and update your application.")
            : "Thanks for applying to become a provider on Matchet. We have received your application and our team is reviewing the information you submitted."}
        </p>

        <div className="provider-status-notice">
          <strong>{rejected ? "Next step" : "What happens next?"}</strong>
          <p>
            {rejected
              ? "Update the required information and submit your application again when you are ready."
              : "You will receive an email and in-app notification when a decision has been made. Until your application is approved, provider dashboard features are not available."}
          </p>
        </div>

        <div className="provider-application-status-actions">
          {!rejected && (
            <button type="button" className="provider-status-primary" onClick={() => loadStatus(true)} disabled={refreshing}>
              {refreshing ? "Checking status..." : "Refresh application status"}
            </button>
          )}
          {rejected && <Link to="/provider/onboarding" className="provider-status-primary">Update application</Link>}
          <Link to="/" className="provider-status-secondary">Return to Matchet home</Link>
        </div>

        <p className="provider-status-footnote">
          You can safely leave this page. Your application remains under review while you wait for an update.
        </p>
      </div>
    </main>
  );
}
