const express = require("express");
const requireAuth = require("../middleware/auth");
const { requireAdmin, listProviderApplications, reviewProviderApplication, listSellerApplications, reviewSellerApplication } = require("../controllers/admin-provider.controller");

const router = express.Router();

router.get("/providers/applications", requireAuth, requireAdmin, listProviderApplications);
router.patch("/providers/applications/:applicationId", requireAuth, requireAdmin, reviewProviderApplication);
router.get("/sellers/applications", requireAuth, requireAdmin, listSellerApplications);
router.patch("/sellers/applications/:applicationId", requireAuth, requireAdmin, reviewSellerApplication);

module.exports = router;
