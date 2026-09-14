// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const savedItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  itemType: { type: String, required: true, enum: ["product", "service"], index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", index: true },
}, { timestamps: true });

savedItemSchema.pre("validate", function validateSavedItem(next) {
  const hasProduct = Boolean(this.productId);
  const hasService = Boolean(this.serviceId);

  if (hasProduct === hasService) {
    this.invalidate("productId", "A saved item must reference exactly one product or service.");
  }

  if (this.itemType === "product" && !hasProduct) {
    this.invalidate("productId", "A product saved item must reference a product.");
  }

  if (this.itemType === "service" && !hasService) {
    this.invalidate("serviceId", "A service saved item must reference a service.");
  }

  next();
});

savedItemSchema.index({ userId: 1, productId: 1 }, { unique: true, partialFilterExpression: { productId: { $exists: true } } });
savedItemSchema.index({ userId: 1, serviceId: 1 }, { unique: true, partialFilterExpression: { serviceId: { $exists: true } } });

module.exports = mongoose.model("SavedItem", savedItemSchema);
