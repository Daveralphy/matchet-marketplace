
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteAccount } from "../api/auth";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import "./BuyerAccount.css";
import "./AccountForms.css";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentPassword) {
      showToast("Please enter your current password.", "error");
      return;
    }

    if (!confirmed) {
      showToast("Please confirm that you understand the consequences.", "error");
      return;
    }

    setLoading(true);

    try {
      await deleteAccount({ currentPassword });

      // Clear the frontend authentication state after account closure.
      await logout().catch(() => {});

      navigate("/", { replace: true });
    } catch (requestError) {
      showToast(requestError.message || "Unable to close your account right now.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="buyer-account-page">
      <div className="buyer-account-container">
        <div className="buyer-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/profile">My Profile</Link>
          <span>›</span>
          <span>Close Account</span>
        </div>

        <header>
          <h1>Close Account</h1>
          <p>
            Review the information below before closing your Matchet account.
          </p>
        </header>

        <section className="settings-card account-form-card">
          <div className="account-form-intro">
            <h2>Before you continue</h2>

            <p>
              Closing your account will deactivate it and sign you out.
              You will no longer be able to use this account to access Matchet.
            </p>

            <p>
              Your account cannot be closed while you have unresolved orders,
              active bookings, or pending payouts. Transaction history will
              be preserved where needed for marketplace records.
            </p>

            <p>
              This action cannot currently be reversed through this page.
              Contact Matchet support if you need help with your account.
            </p>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            <label className="account-form-field">
              <span>Current password</span>
              <small>
                Confirm your identity before closing your account.
              </small>

              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </label>

            <label className="account-form-checkbox">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                required
                disabled={loading}
              />

              <span>
                <strong>Confirm account closure</strong>
                <small>
                  I understand that my account will be deactivated and I will
                  be signed out.
                </small>
              </span>
            </label>\n<div className="account-form-actions">
              <button type="submit" disabled={loading || !confirmed}>
                {loading ? "Closing account..." : "Close my account"}
              </button>

              <Link to="/profile">Cancel</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}