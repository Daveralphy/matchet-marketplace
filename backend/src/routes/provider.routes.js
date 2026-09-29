const express = require("express");
const requireAuth = require("../middleware/auth");
const { getProviderDashboard, getProviderServices, getProviderEarnings, getProviderReviews, getProviderProfile, getProviderSettings, updateProviderSettingsPreferences, submitProviderOnboarding, getProviderBookings, getProviderCapabilities, submitSellerOnboarding, getSellerDashboard, getSellerOrders, updateSellerOrderStatus } = require("../controllers/provider.controller");
const {
  getProviderMessages,
  getProviderConversation,
  sendProviderMessage,
} = require("../controllers/provider-message.controller");

const router = express.Router();

router.post("/onboarding", requireAuth, submitProviderOnboarding);
router.post("/seller-onboarding", requireAuth, submitSellerOnboarding);
router.get("/capabilities", requireAuth, getProviderCapabilities);
router.get("/seller-dashboard", requireAuth, getSellerDashboard);
router.get("/seller-orders", requireAuth, getSellerOrders);
router.patch("/seller-orders/:orderId/status", requireAuth, updateSellerOrderStatus);
router.get("/dashboard", requireAuth, getProviderDashboard);
router.get("/services", requireAuth, getProviderServices);
router.get("/bookings", requireAuth, getProviderBookings);
router.get("/earnings", requireAuth, getProviderEarnings);
router.get("/reviews", requireAuth, getProviderReviews);
router.get("/messages", requireAuth, getProviderMessages);
router.get("/messages/:conversationId", requireAuth, getProviderConversation);
router.post("/messages", requireAuth, sendProviderMessage);

module.exports = router;

router.get("/profile", requireAuth, getProviderProfile);
router.get("/settings", requireAuth, getProviderSettings);
router.patch("/settings/preferences", requireAuth, updateProviderSettingsPreferences);
