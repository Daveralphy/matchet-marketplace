const express = require("express");
const requireAuth = require("../middleware/auth");
const { getInbox, getConversation, sendMessage } = require("../controllers/message.controller");

const router = express.Router();

router.get("/", requireAuth, getInbox);
router.get("/:conversationId", requireAuth, getConversation);
router.post("/", requireAuth, sendMessage);

module.exports = router;
