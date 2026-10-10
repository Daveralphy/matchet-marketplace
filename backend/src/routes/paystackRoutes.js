const express = require("express");
const requireAuth = require("../middleware/auth");
const { initializePaystackPayment, verifyPaystackPayment } = require("../controllers/paystackController");

const router = express.Router();
router.use(requireAuth);
router.post("/initialize", initializePaystackPayment);
router.get("/verify/:reference", verifyPaystackPayment);

module.exports = router;
