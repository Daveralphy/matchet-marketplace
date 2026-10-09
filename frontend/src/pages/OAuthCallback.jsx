import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState("Finishing your Google sign-in...");

  useEffect(() => {
    let active = true;
    refreshUser().then((user) => {
      if (!active) return;
      if (user) navigate("/", { replace: true });
      else {
        setMessage("We could not finish signing you in. Please try again.");
        window.setTimeout(() => navigate("/login?authError=google_sign_in_failed", { replace: true }), 1400);
      }
    });
    return () => { active = false; };
  }, [navigate, refreshUser]);

  return <main className="flex min-h-screen items-center justify-center bg-white px-5"><p role="status" className="text-sm font-medium text-[#10183f]">{message}</p></main>;
}
