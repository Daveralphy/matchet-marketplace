require("dotenv").config();

const app = require("../src/app");
const connectDatabase = require("../src/config/database");

let databasePromise;

async function ensureDatabaseConnection() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = connectDatabase();

  try {
    await databasePromise;
  } catch (error) {
    databasePromise = null;
    throw error;
  }

  return databasePromise;
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
