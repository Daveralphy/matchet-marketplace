import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../api/auth";

export default function ForgotPassword() {
  useEffect(() => { document.title = "Forgot Password | Matchet"; }, []);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.message || "If an active account exists for that email, a reset link has been sent.");
    } catch (requestError) {
      setError(requestError.message || "We could not send the reset email. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-5 py-12">
      <section className="w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <Link to="/login" className="text-sm font-semibold text-[#07983f] hover:text-[#068936]">← Back to login</Link>
        <h1 className="mt-7 text-3xl font-extrabold tracking-tight text-[#10183f]">Forgot your password?</h1>
        <p className="mt-3 text-sm leading-6 text-[#747ca1]">Enter the email address connected to your Matchet account. We will send you a secure link to reset your password.</p>
        {message && <div role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
        {error && <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-[#10183f]">Email address</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[#07983f]" />
          </div>
          <button type="submit" disabled={submitting} className="h-12 w-full rounded-lg bg-[#07983f] px-4 font-semibold text-white transition hover:bg-[#068936] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending link..." : "Send reset link"}</button>
        </form>
      </section>
    </main>
  );
}
