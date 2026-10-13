const express = require("express");
const { listListingReviews } = require("../controllers/review.controller");
const router = express.Router();
router.get("/:kind/:id/reviews", listListingReviews);
module.exports = router;
