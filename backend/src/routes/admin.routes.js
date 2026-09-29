const express = require("express");
const requireAuth = require("../middleware/auth");
const { requireAdmin, listProviderApplications, reviewProviderApplication } = require("../controllers/admin-provider.controller");

const router = express.Router();

router.get("/providers/applications", requireAuth, requireAdmin, listProviderApplications);
router.patch("/providers/applications/:applicationId", requireAuth, requireAdmin, reviewProviderApplication);

module.exports = router;
