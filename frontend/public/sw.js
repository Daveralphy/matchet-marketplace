self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = { body: event.data?.text() || "" }; }
  const title = String(payload.title || "Matchet Marketplace").slice(0, 120);
  const body = String(payload.body || "You have a new update on Matchet.").slice(0, 240);
  const url = typeof payload.url === "string" && payload.url.startsWith("/") && !payload.url.startsWith("//") ? payload.url : "/";
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.notificationId ? "matchet-" + payload.notificationId : "matchet-update",
    data: { url },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) return existing.navigate(url).then((client) => client.focus());
    return self.clients.openWindow(url);
  }));
});
