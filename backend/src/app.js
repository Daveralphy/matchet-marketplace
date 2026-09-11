// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Matchet API is running",
  });
});

module.exports = app;