import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/auth";
import { showToast } from "../utils/toast";
import "../styles/auth/auth.css";

export default function ForgotPassword() {
  useEffect(() => { document.title = "Forgot Password | Matchet"; }, []);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await requestPasswordReset(email.trim());
      showToast(response.message || "If an active account exists for that email, a reset link has been sent.", "success");
    } catch (requestError) {
      showToast(requestError.message || "We could not send the reset email. Please try again later.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page flex min-h-screen items-center justify-center bg-[#f8faf8] px-5 py-12">
      <section className="w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <Link to="/login" className="text-sm font-semibold text-brand-bright hover:text-brand-mid">← Back to login</Link>
        <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-ink">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-6 text-subtle">Enter the email address connected to your Matchet account. We will send you a secure link to reset your password.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-ink">Email address</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-brand-bright" />
          </div>
          <button type="submit" disabled={submitting} className="h-12 w-full rounded-lg bg-brand-bright px-4 font-semibold text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending link..." : "Send reset link"}</button>
        </form>
      </section>
    </main>
  );
}
