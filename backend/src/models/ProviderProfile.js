// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const serviceAreaSchema = new mongoose.Schema({
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
}, { _id: false });

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  businessName: { type: String, required: true, trim: true, maxlength: 150 },
  bio: { type: String, trim: true, maxlength: 2000 },
  skills: { type: [String], default: [] },
  categories: { type: [String], required: true, default: [] },
  experience: { type: String, trim: true },
  serviceArea: { type: serviceAreaSchema },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
    index: true,
  },
  status: {
    type: String,
    enum: ["draft", "active", "suspended"],
    default: "draft",
    index: true,
  },
  ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);
