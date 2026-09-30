const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const providerRoutes = require("./routes/provider.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

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
  requireDatabase("Matchet is temporarily unable to reach the account database. Please try again in a moment."),
  authRoutes,
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
  "/api/uploads",
  requireDatabase("Matchet is temporarily unable to reach the upload database. Please try again in a moment."),
  uploadRoutes,
);

module.exports = app;
