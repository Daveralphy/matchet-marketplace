const express = require("express");
const requireAuth = require("../middleware/auth");
const { listNotifications, markNotificationsRead } = require("../controllers/notification.controller");

const router = express.Router();
router.get("/", requireAuth, listNotifications);
router.patch("/read", requireAuth, markNotificationsRead);
module.exports = router;
