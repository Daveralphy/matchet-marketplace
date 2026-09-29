// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const providerRoutes = require("./routes/provider.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Matchet API is running" });
});

app.use("/api/auth", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Matchet is temporarily unable to reach the account database. Please try again in a moment.",
      code: "DATABASE_UNAVAILABLE",
    });
  }
  next();
}, authRoutes);

app.use("/api/admin", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Matchet is temporarily unable to reach the provider database. Please try again in a moment.",
      code: "DATABASE_UNAVAILABLE",
    });
  }
  next();
}, providerRoutes);

module.exports = app;

app.use("/api/admin", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Matchet is temporarily unable to reach the provider database. Please try again in a moment.",
      code: "DATABASE_UNAVAILABLE",
    });
  }
  next();
}, adminRoutes);

module.exports = app;
