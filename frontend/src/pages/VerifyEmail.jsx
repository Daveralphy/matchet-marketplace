import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { changeVerificationEmail, resendVerificationEmail, verifyEmail } from "../api/auth";
import logo from "../assets/logo/matchet_logoname.png";

function formatCooldown(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token") || "";
  const initialEmail = location.state?.email || query.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(token ? "verifying" : "waiting");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(Number(location.state?.resendCooldownSeconds || 0));
  const verificationStarted = useRef("");

  useEffect(() => { document.title = "Verify your email | Matchet"; }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldownSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!token || verificationStarted.current === token) return;
    verificationStarted.current = token;
    let active = true;
    verifyEmail(token).then((response) => {
      if (!active) return;
      setEmail(response.email || initialEmail);
      setMessage(response.message || "Your email is verified. Your account is ready.");
      setStatus("success");
    }).catch((error) => {
      if (!active) return;
      setMessage(error.message || "This verification link is invalid or expired. Request a new one below.");
      setStatus("error");
    });
    return () => { active = false; };
  }, [token, initialEmail]);

  const resend = async () => {
    if (!email.trim() || busy || cooldownSeconds > 0) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await resendVerificationEmail(email.trim());
      setMessage(response.message || "If your account needs verification, an email will be sent shortly.");
      setCooldownSeconds(Number(response.resendCooldownSeconds || 60));
      setStatus("sent");
    } catch (error) {
      if (error.retryAfterSeconds) setCooldownSeconds(Number(error.retryAfterSeconds));
      setMessage(error.message || "Unable to resend the verification email right now.");
    } finally {
      setBusy(false);
    }
  };

  const changeEmail = async (event) => {
    event.preventDefault();
    if (busy || cooldownSeconds > 0) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await changeVerificationEmail({
        currentEmail: email.trim(),
        newEmail: newEmail.trim(),
        password,
      });
      setEmail(response.email || newEmail.trim());
      setNewEmail("");
      setPassword("");
      setShowChangeEmail(false);
      setStatus("sent");
      setCooldownSeconds(Number(response.resendCooldownSeconds || 60));
      setMessage(response.message || "Your email has been updated. Check the new inbox for your verification link.");
    } catch (error) {
      if (error.retryAfterSeconds) setCooldownSeconds(Number(error.retryAfterSeconds));
      if (error.email) setEmail(error.email);
      setMessage(error.message || "Unable to change your email address right now.");
    } finally {
      setBusy(false);
    }
  };

  const verified = status === "success";
  const isVerifying = status === "verifying";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9f8] px-4 py-10 sm:px-6">
      <section className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[#e3e9e5] bg-white shadow-[0_18px_55px_rgba(16,24,63,.07)]">
        <header className="flex items-center justify-center border-b border-[#edf0ee] bg-white px-7 py-6">
          <Link to="/" aria-label="Matchet home" className="inline-flex items-center">
            <img src={logo} alt="Matchet" className="h-9 w-auto max-w-[190px] object-contain" />
          </Link>
        </header>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${verified ? "bg-green-100 text-green-700" : "bg-[#eaf8ef] text-[#07863a]"}`} aria-hidden="true">
            {verified ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
            )}
          </div>

          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#07863a]">Account security</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#10183f]">
            {isVerifying ? "Verifying your email…" : verified ? "Email verified!" : "Verify your email"}
          </h1>

          <p className="mt-3 text-[15px] leading-7 text-[#626c8b]">
            {isVerifying
              ? "Please wait while we securely confirm your email address."
              : verified
                ? "Your Matchet Marketplace account is now verified. We’ve sent a confirmation email and a separate welcome email to help you get started."
                : <>We have created your account, but it is not active until you verify your email{email ? <> <span className="font-semibold text-[#10183f]">{email}</span></> : ""}. Open the verification link we sent you. If you can’t find it, check your spam or junk folder.</>}
          </p>

          {message && (
            <p role="status" className={`mt-5 rounded-lg px-4 py-3 text-sm leading-6 ${verified ? "bg-green-50 text-green-800" : status === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-800"}`}>
              {message}
            </p>
          )}

          {verified ? (
            <button onClick={() => navigate("/login", { replace: true })} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white transition hover:bg-[#067632]">
              Continue to log in
            </button>
          ) : !isVerifying && (
            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={resend}
                disabled={busy || cooldownSeconds > 0 || !email}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white transition hover:bg-[#067632] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (showChangeEmail ? "Updating email…" : "Sending…") : cooldownSeconds > 0 ? `Resend email in ${formatCooldown(cooldownSeconds)}` : "Resend verification email"}
              </button>

              <button
                type="button"
                onClick={() => { setShowChangeEmail((visible) => !visible); setMessage(""); }}
                disabled={busy}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#dfe5e2] bg-white px-5 py-3 font-semibold text-[#10183f] transition hover:bg-[#f8faf9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showChangeEmail ? "Cancel email change" : "Change email address"}
              </button>

              {cooldownSeconds > 0 && (
                <p className="text-center text-xs text-[#747c99]">
                  To protect your account, you can request another verification email in {formatCooldown(cooldownSeconds)}.
                </p>
              )}

              {showChangeEmail && (
                <form onSubmit={changeEmail} className="mt-4 space-y-4 rounded-xl border border-[#e5e9ef] bg-[#fafbfc] p-4 sm:p-5">
                  <div>
                    <h2 className="text-base font-bold text-[#10183f]">Change email address</h2>
                    <p className="mt-1 text-sm leading-6 text-[#747c99]">We’ll send a fresh verification link to the new address. Your account will remain inactive until you verify it.</p>
                  </div>
                  <div>
                    <label htmlFor="current-verification-email" className="mb-1.5 block text-sm font-semibold text-[#10183f]">Current email</label>
                    <input id="current-verification-email" type="email" value={email} readOnly required className="h-11 w-full rounded-lg border border-[#dfe4eb] bg-[#f1f3f5] px-3 text-sm text-[#626c8b]" />
                  </div>
                  <div>
                    <label htmlFor="new-verification-email" className="mb-1.5 block text-sm font-semibold text-[#10183f]">New email address</label>
                    <input id="new-verification-email" type="email" autoComplete="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required placeholder="Enter your new email" className="h-11 w-full rounded-lg border border-[#dfe4eb] bg-white px-3 text-sm text-[#10183f] outline-none focus:border-[#07863a]" />
                  </div>
                  <div>
                    <label htmlFor="verification-password" className="mb-1.5 block text-sm font-semibold text-[#10183f]">Account password</label>
                    <input id="verification-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="h-11 w-full rounded-lg border border-[#dfe4eb] bg-white px-3 text-sm text-[#10183f] outline-none focus:border-[#07863a]" />
                    <p className="mt-1 text-xs leading-5 text-[#747c99]">This confirms you own the unverified account before changing its email.</p>
                  </div>
                  <button type="submit" disabled={busy || cooldownSeconds > 0} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#10183f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1b275b] disabled:cursor-not-allowed disabled:opacity-60">
                    {busy && showChangeEmail ? "Updating email…" : cooldownSeconds > 0 ? `Available in ${formatCooldown(cooldownSeconds)}` : "Update email and send link"}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-[#747c99]">Already verified? <Link to="/login" className="font-semibold text-[#07863a] hover:underline">Log in</Link></p>
          <p className="mt-5 text-center text-xs leading-5 text-[#8a91a8]">Matchet will never ask you to share your password by email.</p>
        </div>
      </section>
    </main>
  );
}
