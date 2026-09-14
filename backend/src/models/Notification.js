// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: [
      "ORDER_CONFIRMED",
      "ORDER_SHIPPED",
      "ORDER_DELIVERED",
      "BOOKING_CONFIRMED",
      "BOOKING_CANCELLED",
      "NEW_MESSAGE",
      "NEW_REVIEW",
      "PAYMENT_SUCCESS",
    ],
    index: true,
  },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedType: { type: String, trim: true },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
