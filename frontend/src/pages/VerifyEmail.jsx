import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../api/auth";

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
  const verificationStarted = useRef("");

  useEffect(() => { document.title = "Verify your email | Matchet"; }, []);
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

  const resend = async (event) => {
    event.preventDefault();
    if (!email.trim()) { setMessage("Enter the email address you used to create your account."); return; }
    setBusy(true);
    setMessage("");
    try {
      const response = await resendVerificationEmail(email.trim());
      setMessage(response.message || "If your account needs verification, an email will be sent shortly.");
      setStatus("sent");
    } catch (error) {
      setMessage(error.message || "Unable to resend the verification email right now.");
    } finally { setBusy(false); }
  };

  const verified = status === "success";
  return (
    <main className="min-h-screen bg-[#f7f9f8] px-4 py-12 sm:px-6">
      <section className="mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#e3e9e5] bg-white shadow-[0_18px_55px_rgba(16,24,63,.07)]">
        <header className="bg-[#10183f] px-7 py-6 text-white sm:px-10">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">Matchet<span className="text-[#45d483]">.</span></Link>
          <p className="mt-1 text-xs text-white/75">Marketplace</p>
        </header>
        <div className="px-7 py-9 sm:px-10 sm:py-11">
          <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${verified ? "bg-green-100 text-green-700" : "bg-[#eaf8ef] text-[#07863a]"}`} aria-hidden="true">
            {verified ? <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>}
          </div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#07863a]">Account security</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#10183f]">
            {status === "verifying" ? "Verifying your email…" : verified ? "Email verified!" : "Check your email"}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#626c8b]">
            {status === "verifying" ? "Please wait while we securely confirm your email address." :
             verified ? "Your Matchet Marketplace account is now verified. We have sent you a confirmation email and a separate welcome email with useful links to get started." :
             "We’ve created your account, but it is not active until you verify your email. Open the verification link we sent you. If you can’t find it, check your spam or junk folder."}
          </p>
          {email && <div className="mt-5 rounded-xl border border-[#e5e9ef] bg-[#fafbfc] px-4 py-3 text-sm text-[#10183f]"><span className="text-[#747c99]">Email address</span><p className="mt-1 break-all font-semibold">{email}</p></div>}
          {message && <p role="status" className={`mt-5 rounded-lg px-4 py-3 text-sm leading-6 ${verified ? "bg-green-50 text-green-800" : status === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-800"}`}>{message}</p>}
          {verified ? (
            <button onClick={() => navigate("/login", { replace: true })} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white transition hover:bg-[#067632]">Continue to log in</button>
          ) : (
            <form onSubmit={resend} className="mt-7">
              {!email && <label htmlFor="verification-email" className="mb-2 block text-sm font-semibold text-[#10183f]">Email address</label>}
              {!email && <input id="verification-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mb-3 h-12 w-full rounded-lg border border-[#dfe4eb] px-4 text-sm outline-none focus:border-[#07863a]"/>}
              <button disabled={busy || status === "verifying"} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#07863a] px-5 py-3 font-semibold text-white transition hover:bg-[#067632] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Sending…" : "Resend verification email"}</button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-[#747c99]">Already verified? <Link to="/login" className="font-semibold text-[#07863a] hover:underline">Log in</Link></p>
          <p className="mt-6 text-center text-xs leading-5 text-[#8a91a8]">Matchet will never ask you to share your password by email.</p>
        </div>
      </section>
    </main>
  );
}
