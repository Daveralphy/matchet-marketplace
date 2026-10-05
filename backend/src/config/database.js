// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

let listenersAttached = false;

function attachConnectionLogging() {
  if (listenersAttached) {
    return;
  }

  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    console.log("[MongoDB] connected", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
    });
  });

  mongoose.connection.on("disconnected", () => {
    console.error("[MongoDB] disconnected", {
      readyState: mongoose.connection.readyState,
    });
  });

  mongoose.connection.on("error", (error) => {
    console.error("[MongoDB] connection error", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      codeName: error?.codeName,
    });
  });
}

async function connectDatabase() {
  attachConnectionLogging();

  if (!process.env.MONGODB_URI) {
    console.error("[MongoDB] MONGODB_URI is not available at runtime.");
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    console.log("[MongoDB] reusing existing connection", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
    return true;
  }

  try {
    console.log("[MongoDB] attempting connection", {
      readyState: mongoose.connection.readyState,
      nodeEnv: process.env.NODE_ENV || "not-set",
      vercel: process.env.VERCEL || "not-set",
      vercelEnv: process.env.VERCEL_ENV || "not-set",
    });

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log("[MongoDB] connection established", {
      host: connection.connection.host,
      name: connection.connection.name,
      readyState: connection.connection.readyState,
    });

    return true;
  } catch (error) {
    console.error("[MongoDB] connection failed", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      codeName: error?.codeName,
      reason: error?.reason?.message || error?.reason,
      readyState: mongoose.connection.readyState,
    });

    return false;
  }
}

module.exports = connectDatabase;
