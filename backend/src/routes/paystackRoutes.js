const express = require("express");
const requireAuth = require("../middleware/auth");
const { initializePaystackPayment, verifyPaystackPayment, handlePaystackWebhook } = require("../controllers/paystackController");

const router = express.Router();
router.post("/webhook", handlePaystackWebhook);
router.use(requireAuth);
router.post("/initialize", initializePaystackPayment);
router.get("/verify/:reference", verifyPaystackPayment);

module.exports = router;
