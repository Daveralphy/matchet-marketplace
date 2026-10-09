import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { exchangeGoogleSignIn } from "../api/auth";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState("Finishing your Google sign-in...");

  useEffect(() => {
    let active = true;
    const code = searchParams.get("code");
    if (!code) {
      setMessage("We could not finish your Google sign-in. Please try again.");
      return undefined;
    }

    exchangeGoogleSignIn(code).then(() => refreshUser()).then((user) => {
      if (!active) return;
      if (user) navigate("/", { replace: true });
      else setMessage("We could not load your account. Please return to login and try again.");
    }).catch((error) => {
      if (active) setMessage(error.message || "We could not finish your Google sign-in. Please try again.");
    });

    return () => { active = false; };
  }, [navigate, refreshUser, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5">
      <section className="max-w-md text-center">
        <p role="status" className="text-sm font-medium text-[#10183f]">{message}</p>
        {message !== "Finishing your Google sign-in..." && <Link to="/login" className="mt-5 inline-block font-semibold text-[#07983f]">Return to login</Link>}
      </section>
    </main>
  );
}
