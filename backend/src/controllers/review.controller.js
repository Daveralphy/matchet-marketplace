const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Service = require("../models/Service");
const User = require("../models/User");

async function listListingReviews(req, res) {
  try {
    const kind = req.params.kind;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid listing." });
    const Model = kind === "products" ? Product : kind === "services" ? Service : null;
    if (!Model) return res.status(404).json({ success: false, message: "Reviews not found." });
    const listing = await Model.findOne({ _id: id, status: "active" }).select("_id").lean();
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found." });
    const filter = kind === "products" ? { productId: id } : { serviceId: id };
    const reviews = await Review.find({ ...filter, status: "published" }).sort({ createdAt: -1 }).limit(50).populate("reviewerId", "firstName lastName avatar").lean();
    const totalReviews = await Review.countDocuments({ ...filter, status: "published" });
    const averageRating = totalReviews ? Math.round((reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length) * 10) / 10 : 0;
    return res.json({ success: true, summary: { averageRating, totalReviews }, reviews: reviews.map((review) => ({
      id: String(review._id),
      rating: review.rating,
      comment: review.comment || "",
      createdAt: review.createdAt,
      customer: {
        name: [review.reviewerId?.firstName, review.reviewerId?.lastName].filter(Boolean).join(" ") || "Customer",
        avatar: review.reviewerId?.avatar?.url || null,
      },
    })) });
  } catch (error) {
    console.error("List listing reviews failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load reviews right now." });
  }
}

module.exports = { listListingReviews };
