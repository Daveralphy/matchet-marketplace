const express = require("express");
const orderRoutes = require("./routes/orderRoutes");
const paystackRoutes = require("./routes/paystackRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const savedItemRoutes = require("./routes/savedItem.routes");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const providerRoutes = require("./routes/provider.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRoutes = require("./routes/uploadRoutes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const notificationRoutes = require("./routes/notification.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "20mb", verify: (req, res, buffer) => { req.rawBody = Buffer.from(buffer); } }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Location detection is intentionally independent of MongoDB. Vercel supplies
// approximate IP geolocation headers when available; no browser permission is needed.
app.get("/api/location/detect", (req, res) => {
  const clean = (value) => {
    if (!value) return "";
    try { return decodeURIComponent(String(value).replace(/\\+/g, " ")).trim(); }
    catch { return String(value).trim(); }
  };
  const city = clean(req.headers["x-vercel-ip-city"]);
  const state = clean(req.headers["x-vercel-ip-country-region"]);
  const countryCode = clean(req.headers["x-vercel-ip-country"]);
  const countryNames = { NG: "Nigeria", US: "United States", GB: "United Kingdom", CA: "Canada", GH: "Ghana", KE: "Kenya", ZA: "South Africa", IN: "India", AU: "Australia" };
  const country = countryNames[countryCode] || countryCode;
  const label = [city, state, country].filter(Boolean).join(", ");
  return res.json({
    success: true,
    data: {
      source: "ip",
      location: label ? { label, city, state, country, coordinates: null } : null,
    },
  });
});

// Device coordinates are only sent after the visitor explicitly chooses
// "Use my current location". Nominatim resolves those coordinates to a place.
app.get("/api/location/reverse", async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return res.status(400).json({ success: false, message: "Valid coordinates are required." });
  }
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("zoom", "10");
    const response = await fetch(url, { headers: { "User-Agent": "MatchetMarketplace/1.0 (location lookup)" } });
    if (!response.ok) throw new Error("Location lookup failed.");
    const payload = await response.json();
    const address = payload.address || {};
    const city = address.city || address.town || address.village || address.municipality || address.county || "";
    const state = address.state || address.region || address.state_district || "";
    const country = address.country || "";
    const label = [city, state, country].filter(Boolean).join(", ");
    if (!label) return res.status(404).json({ success: false, message: "Could not determine a nearby city." });
    return res.json({
      success: true,
      data: {
        source: "device",
        location: {
          label, city, state, country,
          coordinates: { type: "Point", coordinates: [longitude, latitude] },
        },
      },
    });
  } catch (error) {
    console.error("Reverse geocoding failed:", error.message);
    return res.status(502).json({ success: false, message: "Unable to determine your location right now." });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Matchet API is running" });
});

const requireDatabase = (message) => (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message,
      code: "DATABASE_UNAVAILABLE",
    });
  }
  next();
};

app.use(
  "/api/auth",
  (req, res, next) => {
    // Apple sign-in is a placeholder response and does not depend on MongoDB.
    // Let it return its handled "not available yet" message even during DB outages.
    if (req.path === "/apple") return next();
    return requireDatabase("Matchet is temporarily unable to reach the account database. Please try again in a moment.")(req, res, next);
  },
  authRoutes,
);

app.use(
  "/api/notifications",
  requireDatabase("Matchet is temporarily unable to reach the notification database. Please try again in a moment."),
  notificationRoutes,
);

app.use(
  "/api/cart",
  requireDatabase("Matchet is temporarily unable to reach the cart database. Please try again in a moment."),
  cartRoutes,
);

app.use(
  "/api/orders",
  requireDatabase("Matchet is temporarily unable to reach the orders database. Please try again in a moment."),
  orderRoutes,
);

app.use(
  "/api/payments/paystack",
  requireDatabase("Matchet is temporarily unable to reach the payment database. Please try again in a moment."),
  paystackRoutes,
);

app.use(
  "/api/bookings",
  requireDatabase("Matchet is temporarily unable to reach the bookings database. Please try again in a moment."),
  bookingRoutes,
);

app.use(
  "/api/saved-items",
  requireDatabase("Matchet is temporarily unable to reach the saved items database. Please try again in a moment."),
  savedItemRoutes,
);

app.use(
  "/api/provider",
  requireDatabase("Matchet is temporarily unable to reach the provider database. Please try again in a moment."),
  providerRoutes,
);

app.use(
  "/api/admin",
  requireDatabase("Matchet is temporarily unable to reach the provider database. Please try again in a moment."),
  adminRoutes,
);

app.use(
  "/api/marketplace",
  requireDatabase("Matchet is temporarily unable to reach the marketplace database. Please try again in a moment."),
  marketplaceRoutes,
);

app.use(
  "/api/uploads",
  requireDatabase("Matchet is temporarily unable to reach the upload database. Please try again in a moment."),
  uploadRoutes,
);

module.exports = app;
