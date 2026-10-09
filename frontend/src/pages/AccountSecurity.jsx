
import { useState } from "react";
import { Link } from "react-router-dom";
import { changePassword } from "../api/auth";
import "./BuyerAccount.css";
import "./AccountForms.css";

export default function AccountSecurity() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (newPassword.length < 8) {
            setError("Your new password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Your new passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await changePassword({
                currentPassword,
                newPassword,
            });

            setMessage(response.message || "Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message || "Unable to change your password. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                    <span>Account Security</span>
                </div>

                <header>
                    <h1>Account Security</h1>
                    <p>Manage your password and keep your account secure.</p>
                </header>

                <section className="settings-card account-form-card">
                    <h2>Change password</h2>
                    <p>
                        Update your password to help keep your Matchet account secure.
                    </p>

                    <form className="account-form" onSubmit={handleSubmit}>
                        <div className="account-form-field">
                            <label htmlFor="currentPassword">Current password</label>
                            <input
                                id="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />
                        </div>

                        <div className="account-form-field">
                            <label htmlFor="newPassword">New password</label>
                            <input
                                id="newPassword"
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="account-form-field">
                            <label htmlFor="confirmPassword">Confirm new password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        {error && (
                            <p className="account-form-message account-form-error" role="alert">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className="account-form-message account-form-success" role="status">
                                {message}
                            </p>
                        )}

                        <div className="account-form-actions">
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Changing password..." : "Change password"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}