const express = require("express");
const requireAuth = require("../middleware/auth");
const {
  requireAdmin,
  getAdminDashboard,
  listProviderApplications,
  reviewProviderApplication,
  listSellerApplications,
  reviewSellerApplication,
  listUsers,
  listListings,
  updateUserStatus,
  updateListingStatus,
  recordOrderRefund,
} = require("../controllers/admin-provider.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, requireAdmin, getAdminDashboard);
router.get("/providers/applications", requireAuth, requireAdmin, listProviderApplications);
router.patch("/providers/applications/:applicationId", requireAuth, requireAdmin, reviewProviderApplication);
router.get("/sellers/applications", requireAuth, requireAdmin, listSellerApplications);
router.patch("/sellers/applications/:applicationId", requireAuth, requireAdmin, reviewSellerApplication);
router.get("/users", requireAuth, requireAdmin, listUsers);
router.patch("/users/:userId/status", requireAuth, requireAdmin, updateUserStatus);
router.get("/listings", requireAuth, requireAdmin, listListings);
router.patch("/listings/:type/:listingId/status", requireAuth, requireAdmin, updateListingStatus);
router.patch("/orders/:orderId/refund", requireAuth, requireAdmin, recordOrderRefund);

module.exports = router;
