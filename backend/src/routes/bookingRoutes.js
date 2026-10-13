const express = require("express");
const requireAuth = require("../middleware/auth");
const {
  listBuyerBookings,
  getBuyerBooking,
  listBuyerBookingReviews,
  createBuyerBookingReview,
} = require("../controllers/bookingController");

const router = express.Router();
router.use(requireAuth);
router.get("/", listBuyerBookings);
router.get("/:id/reviews", listBuyerBookingReviews);
router.post("/:id/reviews", createBuyerBookingReview);
router.get("/:id", getBuyerBooking);
module.exports = router;
