// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log("MongoDB connected: " + connection.connection.host);
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Check that your MongoDB Atlas IP access list allows this machine and that MONGODB_URI is correct.");
    return false;
  }
}

module.exports = connectDatabase;
