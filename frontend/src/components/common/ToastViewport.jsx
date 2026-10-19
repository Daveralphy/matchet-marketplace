import { useEffect, useState } from "react";
import "../../styles/shared/toast.css";

const styles = {
  success: { tone: "success", icon: "✓" },
  error: { tone: "error", icon: "!" },
  warning: { tone: "warning", icon: "!" },
  info: { tone: "info", icon: "i" },
};

export default function ToastViewport() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let dismissTimer;
    let removeTimer;
    const show = (event) => {
      window.clearTimeout(dismissTimer);
      window.clearTimeout(removeTimer);
      const next = {
        id: Date.now(),
        message: event.detail?.message || "Something happened.",
        type: event.detail?.type || "info",
        duration: Math.max(1800, Number(event.detail?.duration) || 4200),
        leaving: false,
      };
      setToast(next);
      dismissTimer = window.setTimeout(() => {
        setToast((current) => current ? { ...current, leaving: true } : current);
        removeTimer = window.setTimeout(() => setToast(null), 220);
      }, next.duration);
    };
    window.addEventListener("matchet:toast", show);
    return () => {
      window.removeEventListener("matchet:toast", show);
      window.clearTimeout(dismissTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!toast) return null;
  const palette = styles[toast.type] || styles.info;

  return (
    <div
      className="matchet-toast-viewport"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div
        key={toast.id}
        role={toast.type === "error" ? "alert" : "status"}
        className={`matchet-toast matchet-toast--${palette.tone} ${toast.leaving ? "matchet-toast-leaving" : "matchet-toast-entering"}`}
      >
        <span className="matchet-toast-icon" aria-hidden="true">{palette.icon}</span>
        <p>{toast.message}</p>
        <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}>×</button>
      </div>
    </div>
  );
}
