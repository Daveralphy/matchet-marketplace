const express = require("express");
const requireAuth = require("../middleware/auth");
const { getInbox, startConversation, getConversation, sendMessage, getUnreadCount } = require("../controllers/message.controller");

const router = express.Router();

router.get("/unread-count", requireAuth, getUnreadCount);
router.get("/", requireAuth, getInbox);
router.get("/start/:recipientId", requireAuth, startConversation);
router.get("/:conversationId", requireAuth, getConversation);
router.post("/", requireAuth, sendMessage);

module.exports = router;
