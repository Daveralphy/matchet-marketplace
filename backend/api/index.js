require("dotenv").config();

const app = require("../src/app");
const connectDatabase = require("../src/config/database");
const mongoose = require("mongoose");

let databasePromise;

async function ensureDatabaseConnection() {
  if (databasePromise) {
    const connected = await databasePromise;
    if (connected && mongoose.connection.readyState === 1) {
      return true;
    }
    databasePromise = null;
  }

  databasePromise = connectDatabase();

  try {
    const connected = await databasePromise;
    if (!connected || mongoose.connection.readyState !== 1) {
      databasePromise = null;
      return false;
    }
    return true;
  } catch (error) {
    databasePromise = null;
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    const connected = await ensureDatabaseConnection();

    if (!connected) {
      return res.status(503).json({
        success: false,
        message: "Matchet is temporarily unable to reach the database.",
        code: "DATABASE_UNAVAILABLE",
      });
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel API startup error:", error);

    return res.status(503).json({
      success: false,
      message: "Matchet is temporarily unavailable. Please try again in a moment.",
      code: "SERVICE_UNAVAILABLE",
    });
  }
};
