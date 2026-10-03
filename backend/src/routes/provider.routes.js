const express = require("express");
const requireAuth = require("../middleware/auth");
const { requireActiveProvider, requireActiveSeller } = require("../middleware/providerAccess");
const { searchProviderLocations, getOnboardingProgress, getProviderDashboard, getProviderServices, getProviderEarnings, getProviderReviews, getProviderProfile, getProviderSettings, updateProviderSettingsPreferences, submitProviderOnboarding, getProviderBookings, getProviderCapabilities, getProviderOnboardingDraft, getSellerOnboardingDraft, submitSellerOnboarding, getSellerDashboard, getSellerOrders, getSellerOrderDetail, addSellerOrderNote, updateSellerOrderStatus, getSellerProducts, createSellerProduct, updateSellerProduct, deleteSellerProduct, createProviderService, updateProviderService, deleteProviderService, getSellerEarnings, getSellerReviews, getSellerProfile, updateSellerProfile, getSellerSettings, updateSellerSettingsPreferences, updateSellerSettingsStore, getPublicSellerStore } = require("../controllers/provider.controller");
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
router.get("/locations/search", requireAuth, searchProviderLocations);
router.get("/onboarding/progress", requireAuth, getOnboardingProgress);
router.get("/capabilities", requireAuth, getProviderCapabilities);
router.get("/seller-dashboard", requireAuth, requireActiveSeller, getSellerDashboard);
router.get("/seller-orders", requireAuth, requireActiveSeller, getSellerOrders);
router.get("/seller-orders/:orderId", requireAuth, requireActiveSeller, getSellerOrderDetail);
router.patch("/seller-orders/:orderId/note", requireAuth, requireActiveSeller, addSellerOrderNote);
router.patch("/seller-orders/:orderId/status", requireAuth, requireActiveSeller, updateSellerOrderStatus);
router.get("/seller-products", requireAuth, requireActiveSeller, getSellerProducts);
router.get("/seller-earnings", requireAuth, requireActiveSeller, getSellerEarnings);
router.get("/seller-reviews", requireAuth, requireActiveSeller, getSellerReviews);
router.post("/seller-products", requireAuth, requireActiveSeller, createSellerProduct);
router.patch("/seller-products/:productId", requireAuth, requireActiveSeller, updateSellerProduct);
router.delete("/seller-products/:productId", requireAuth, requireActiveSeller, deleteSellerProduct);
router.get("/dashboard", requireAuth, requireActiveProvider, getProviderDashboard);
router.get("/services", requireAuth, requireActiveProvider, getProviderServices);
router.post("/services", requireAuth, requireActiveProvider, createProviderService);
router.patch("/services/:serviceId", requireAuth, requireActiveProvider, updateProviderService);
router.delete("/services/:serviceId", requireAuth, requireActiveProvider, deleteProviderService);
router.get("/bookings", requireAuth, requireActiveProvider, getProviderBookings);
router.get("/earnings", requireAuth, requireActiveProvider, getProviderEarnings);
router.get("/reviews", requireAuth, requireActiveProvider, getProviderReviews);
router.get("/messages", requireAuth, requireActiveProvider, getProviderMessages);
router.get("/messages/:conversationId", requireAuth, requireActiveProvider, getProviderConversation);
router.post("/messages", requireAuth, requireActiveProvider, sendProviderMessage);

module.exports = router;

router.get("/profile", requireAuth, getProviderProfile);
router.get("/settings", requireAuth, requireActiveProvider, getProviderSettings);
router.patch("/settings/preferences", requireAuth, requireActiveProvider, updateProviderSettingsPreferences);

router.get("/seller-profile", requireAuth, getSellerProfile);
router.patch("/seller-profile", requireAuth, updateSellerProfile);
router.get("/seller-settings", requireAuth, getSellerSettings);
router.patch("/seller-settings/preferences", requireAuth, updateSellerSettingsPreferences);
router.patch("/seller-settings/store", requireAuth, updateSellerSettingsStore);

router.get("/store/:slug", getPublicSellerStore);
