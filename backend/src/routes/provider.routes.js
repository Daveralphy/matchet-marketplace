const express = require("express");
const requireAuth = require("../middleware/auth");
const { getProviderDashboard, getProviderServices } = require("../controllers/provider.controller");
const {
  getProviderMessages,
  getProviderConversation,
  sendProviderMessage,
} = require("../controllers/provider-message.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, getProviderDashboard);
router.get("/services", requireAuth, getProviderServices);
router.get("/messages", requireAuth, getProviderMessages);
router.get("/messages/:conversationId", requireAuth, getProviderConversation);
router.post("/messages", requireAuth, sendProviderMessage);

module.exports = router;
