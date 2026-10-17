// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: [
      "ACCOUNT_VERIFIED", "WELCOME", "NEW_DEVICE_LOGIN", "ORDER_CREATED",
      "ORDER_CONFIRMED", "ORDER_PROCESSING", "ORDER_SHIPPED", "ORDER_OUT_FOR_DELIVERY",
      "ORDER_CANCELLED", "ORDER_DELIVERED", "BOOKING_CREATED", "BOOKING_CONFIRMED",
      "BOOKING_COMPLETED", "BOOKING_CANCELLED", "NEW_MESSAGE", "NEW_REVIEW",
      "PAYMENT_SUCCESS", "PAYMENT_FAILED", "PROVIDER_APPLICATION_SUBMITTED",
      "PROVIDER_APPLICATION_APPROVED", "PROVIDER_APPLICATION_REJECTED",
      "SELLER_APPLICATION_SUBMITTED", "SELLER_APPLICATION_APPROVED", "SELLER_APPLICATION_REJECTED",
      "RECOMMENDATIONS",
    ],
    index: true,
  },
  category: { type: String, enum: ["account", "security", "orders", "bookings", "payments", "applications", "messages", "recommendations"], default: "account", index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  actionUrl: { type: String, trim: true, maxlength: 500 },
  actionLabel: { type: String, trim: true, maxlength: 80 },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedType: { type: String, trim: true },
  idempotencyKey: { type: String, trim: true, maxlength: 200 },
  isRead: { type: Boolean, default: false, index: true },
  deliveredChannels: { type: [String], enum: ["in_app", "email", "push"], default: ["in_app"] },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Notification", notificationSchema);
