export function showToast(message, type = "info", duration = 4200) {
  if (!message || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("matchet:toast", {
    detail: { message: String(message), type, duration },
  }));
}
