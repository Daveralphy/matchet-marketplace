// Created by: Raphael Daveal
// Edited by: Raphael Daveal

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Matchet API running on port ${PORT}`);
});