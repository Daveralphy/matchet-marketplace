const express = require("express");
const requireAuth = require("../middleware/auth");
const { listNotifications, markNotificationsRead, markNotificationRead } = require("../controllers/notification.controller");

const router = express.Router();
router.get("/", requireAuth, listNotifications);
router.patch("/read", requireAuth, markNotificationsRead);
router.patch("/:id/read", requireAuth, markNotificationRead);
module.exports = router;
