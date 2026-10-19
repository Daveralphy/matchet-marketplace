import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { showToast } from "../utils/toast";
import "../styles/auth/auth.css";

export default function ResetPassword() {
  useEffect(() => { document.title = "Reset Password | Matchet"; }, []);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) return showToast("Password must be at least 8 characters.", "error");
    if (password !== confirmPassword) return showToast("The passwords do not match.", "error");
    setSubmitting(true);
    try {
      const response = await resetPassword({ token, password });
      showToast(response.message || "Your password has been reset successfully.", "success");
      setComplete(true);
    } catch (requestError) {
      showToast(requestError.message || "This reset link is invalid or expired. Please request a new one.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page flex min-h-screen items-center justify-center bg-[#f8faf8] px-5 py-12">
      <section className="w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Create a new password</h1>
        <p className="mt-3 text-sm leading-6 text-subtle">Choose a password with at least 8 characters.</p>
        {!token && <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">This reset link is missing its security token. Request a new link to continue.</div>}
        
        
        {!complete && token && <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div><label htmlFor="new-password" className="mb-2 block text-sm font-medium text-ink">New password</label><input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-brand-bright" /></div>
          <div><label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-ink">Confirm new password</label><input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-brand-bright" /></div>
          <button type="submit" disabled={submitting} className="h-12 w-full rounded-lg bg-brand-bright px-4 font-semibold text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Updating password..." : "Reset password"}</button>
        </form>}
        {complete && <button type="button" onClick={() => navigate("/login", { replace: true })} className="mt-6 h-12 w-full rounded-lg bg-brand-bright px-4 font-semibold text-white hover:bg-brand-mid">Go to login</button>}
        {!complete && <p className="mt-6 text-center text-sm text-subtle"><Link to="/forgot-password" className="font-semibold text-brand-bright hover:text-brand-mid">Request a new reset link</Link></p>}
      </section>
    </main>
  );
}
