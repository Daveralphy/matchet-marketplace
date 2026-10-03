import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellerProfile } from "../api/provider";
import "../styles/provider-dashboard.css";

export default function SellerApplicationStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatus = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const response = await getSellerProfile();
      setData(response.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  if (loading) {
    return <main className="provider-application-status-standalone"><div className="provider-application-status-card"><div className="provider-dashboard-skeleton" /><div className="provider-dashboard-skeleton large" /></div></main>;
  }

  const store = data?.store;
  const verification = store?.verificationStatus || "pending";
  const approved = verification === "verified" && store?.status === "active";
  const rejected = verification === "rejected";

  if (approved) {
    return (
      <main className="provider-application-status-standalone">
        <div className="provider-application-status-card">
          <div className="provider-status-mark provider-status-mark-success">✓</div>
          <h1>Application approved</h1>
          <p>Your seller application has been approved. Your seller dashboard is now available.</p>
          <div className="provider-application-status-actions">
            <Link to="/seller/dashboard" className="provider-status-primary">Go to seller dashboard</Link>
            <Link to="/" className="provider-status-secondary">Return to Matchet</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="provider-application-status-standalone">
      <div className="provider-application-status-card">
        <div className={"provider-status-mark " + (rejected ? "provider-status-mark-rejected" : "provider-status-mark-pending")}>{rejected ? "!" : "✓"}</div>
        <h1>{rejected ? "Application needs attention" : "Your application is under review"}</h1>
        <p className="provider-status-lead">
          {rejected
            ? (store?.reviewNote || "Your seller application was not approved. Please review the feedback and update your application.")
            : "Thanks for applying to become a seller on Matchet. We have received your application and our team is reviewing the information you submitted."}
        </p>
        <div className="provider-status-notice">
          <strong>{rejected ? "Next step" : "What happens next?"}</strong>
          <p>{rejected ? "Update the required information and submit your application again when you are ready." : "We will notify you by email and in-app when a decision has been made. Until your application is approved, seller dashboard features are not available."}</p>
        </div>
        <div className="provider-application-status-actions">
          {!rejected && <button type="button" className="provider-status-primary" onClick={() => loadStatus(true)} disabled={refreshing}>{refreshing ? "Checking status..." : "Refresh application status"}</button>}
          {rejected && <Link to="/register" className="provider-status-primary">Update application</Link>}
          <Link to="/" className="provider-status-secondary">Return to Matchet home</Link>
        </div>
        <p className="provider-status-footnote">You can safely leave this page. Your application remains under review while you wait for an update.</p>
      </div>
    </main>
  );
}
