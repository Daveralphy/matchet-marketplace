const express = require("express");
const requireAuth = require("../middleware/auth");
const { getProviderDashboard } = require("../controllers/provider.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, getProviderDashboard);

module.exports = router;