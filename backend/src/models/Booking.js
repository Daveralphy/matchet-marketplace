// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "inProgress", "completed", "cancelled", "declined"],
    default: "pending",
    index: true,
  },
  priceSnapshot: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, uppercase: true },
  },
  notes: { type: String, trim: true, maxlength: 3000 },
}, { timestamps: true });

bookingSchema.index({ buyerId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, scheduledDate: 1, scheduledTime: 1 });
bookingSchema.index({ serviceId: 1, scheduledDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
