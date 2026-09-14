// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", index: true },
  rating: { type: Number, required: true, min: 1, max: 5, validate: { validator: Number.isInteger, message: "Rating must be a whole number from 1 to 5." } },
  comment: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ["published", "hidden"], default: "published", index: true },
}, { timestamps: true });

reviewSchema.pre("validate", function validateReview(next) {
  const hasProduct = Boolean(this.productId);
  const hasService = Boolean(this.serviceId);

  if (hasProduct === hasService) {
    this.invalidate("productId", "A review must reference exactly one product or service.");
  }

  next();
});

reviewSchema.index({ reviewerId: 1, productId: 1 }, { unique: true, partialFilterExpression: { productId: { $exists: true } } });
reviewSchema.index({ reviewerId: 1, serviceId: 1 }, { unique: true, partialFilterExpression: { serviceId: { $exists: true } } });

module.exports = mongoose.model("Review", reviewSchema);
