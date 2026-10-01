const express = require("express");
const requireAuth = require("../middleware/auth");
const { getProviderDashboard, getProviderServices, getProviderEarnings, getProviderReviews, getProviderProfile, getProviderSettings, updateProviderSettingsPreferences, submitProviderOnboarding, getProviderBookings, getProviderCapabilities, getProviderOnboardingDraft, getSellerOnboardingDraft, submitSellerOnboarding, getSellerDashboard, getSellerOrders, getSellerOrderDetail, addSellerOrderNote, updateSellerOrderStatus, getSellerProducts, createSellerProduct, updateSellerProduct, getSellerEarnings, getSellerReviews, getSellerProfile, updateSellerProfile, getSellerSettings, updateSellerSettingsPreferences, updateSellerSettingsStore, getPublicSellerStore } = require("../controllers/provider.controller");
const {
  getProviderMessages,
  getProviderConversation,
  sendProviderMessage,
} = require("../controllers/provider-message.controller");

const router = express.Router();

router.post("/onboarding", requireAuth, submitProviderOnboarding);
router.post("/seller-onboarding", requireAuth, submitSellerOnboarding);
router.get("/seller-onboarding/draft", requireAuth, getSellerOnboardingDraft);
router.get("/onboarding/draft", requireAuth, getProviderOnboardingDraft);
router.get("/capabilities", requireAuth, getProviderCapabilities);
router.get("/seller-dashboard", requireAuth, getSellerDashboard);
router.get("/seller-orders", requireAuth, getSellerOrders);
router.get("/seller-orders/:orderId", requireAuth, getSellerOrderDetail);
router.patch("/seller-orders/:orderId/note", requireAuth, addSellerOrderNote);
router.patch("/seller-orders/:orderId/status", requireAuth, updateSellerOrderStatus);
router.get("/seller-products", requireAuth, getSellerProducts);
router.get("/seller-earnings", requireAuth, getSellerEarnings);
router.get("/seller-reviews", requireAuth, getSellerReviews);
router.post("/seller-products", requireAuth, createSellerProduct);
router.patch("/seller-products/:productId", requireAuth, updateSellerProduct);
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

router.get("/seller-profile", requireAuth, getSellerProfile);
router.patch("/seller-profile", requireAuth, updateSellerProfile);
router.get("/seller-settings", requireAuth, getSellerSettings);
router.patch("/seller-settings/preferences", requireAuth, updateSellerSettingsPreferences);
router.patch("/seller-settings/store", requireAuth, updateSellerSettingsStore);

router.get("/store/:slug", getPublicSellerStore);
