// Created by: Raphael Daveal
// Edited by: Raphael Daveal

require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Matchet API running on port ${PORT}`);
  });
};

startServer();