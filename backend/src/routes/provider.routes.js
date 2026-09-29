const express = require("express");
const requireAuth = require("../middleware/auth");
const { getProviderDashboard, getProviderServices, getProviderEarnings, getProviderReviews, getProviderProfile, getProviderSettings, updateProviderSettingsPreferences } = require("../controllers/provider.controller");
const {
  getProviderMessages,
  getProviderConversation,
  sendProviderMessage,
} = require("../controllers/provider-message.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, getProviderDashboard);
router.get("/services", requireAuth, getProviderServices);
router.get("/earnings", requireAuth, getProviderEarnings);
router.get("/reviews", requireAuth, getProviderReviews);
router.get("/messages", requireAuth, getProviderMessages);
router.get("/messages/:conversationId", requireAuth, getProviderConversation);
router.post("/messages", requireAuth, sendProviderMessage);

module.exports = router;

router.get("/profile", requireAuth, getProviderProfile);
router.get("/settings", requireAuth, getProviderSettings);
router.patch("/settings/preferences", requireAuth, updateProviderSettingsPreferences);
