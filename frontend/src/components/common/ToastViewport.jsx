import { useEffect, useState } from "react";

const styles = {
  success: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534", icon: "✓" },
  error: { border: "#fecaca", background: "#fef2f2", color: "#b91c1c", icon: "!" },
  warning: { border: "#fde68a", background: "#fffbeb", color: "#92400e", icon: "!" },
  info: { border: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8", icon: "i" },
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
        className={`matchet-toast ${toast.leaving ? "matchet-toast-leaving" : "matchet-toast-entering"}`}
        style={{ borderColor: palette.border, background: palette.background, color: palette.color }}
      >
        <span className="matchet-toast-icon" aria-hidden="true">{palette.icon}</span>
        <p>{toast.message}</p>
        <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}>×</button>
      </div>
      <style>{`
        .matchet-toast-viewport { position: fixed; z-index: 10000; top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right)); width: min(420px, calc(100vw - 32px)); pointer-events: none; }
        .matchet-toast { display: flex; align-items: flex-start; gap: 11px; padding: 14px 14px; border: 1px solid; border-radius: 12px; box-shadow: 0 12px 34px rgba(16,24,63,.16); font: 500 13px/1.5 "Poppins", ui-sans-serif, system-ui, sans-serif; pointer-events: auto; transform-origin: top right; }
        .matchet-toast-entering { animation: matchet-toast-in 220ms cubic-bezier(.2,.8,.2,1) both; }
        .matchet-toast-leaving { animation: matchet-toast-out 220ms ease-in both; }
        .matchet-toast p { flex: 1; margin: 0; overflow-wrap: anywhere; }
        .matchet-toast-icon { display: grid; place-items: center; flex: 0 0 21px; width: 21px; height: 21px; border: 1px solid currentColor; border-radius: 50%; font-size: 12px; font-weight: 700; }
        .matchet-toast button { border: 0; background: transparent; color: inherit; opacity: .7; cursor: pointer; font-size: 22px; line-height: 1; padding: 0 1px; }
        .matchet-toast button:hover { opacity: 1; }
        @keyframes matchet-toast-in { from { opacity: 0; transform: translateY(-10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes matchet-toast-out { to { opacity: 0; transform: translateY(-8px) scale(.98); } }
        @media (prefers-reduced-motion: reduce) { .matchet-toast-entering, .matchet-toast-leaving { animation-duration: 1ms; } }
      `}</style>
    </div>
  );
}
