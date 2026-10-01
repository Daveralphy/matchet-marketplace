// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (value) => value === undefined || value.length === 2,
          message: "Coordinates must contain longitude and latitude.",
        },
      },
    },
  },
  { _id: false },
);
const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false },
);

const storeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
    category: { type: String, trim: true },
    languages: { type: [String], default: [] },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
    businessDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    shippingPolicies: { type: mongoose.Schema.Types.Mixed, default: {} },
    payoutDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    onboardingData: { type: mongoose.Schema.Types.Mixed, default: {} },

    onboardingStatus: {
      type: String,
      enum: ["in_progress", "submitted"],
      default: "in_progress",
      index: true,
    },

    logo: {
      type: imageSchema,
    },

    banner: {
      type: imageSchema,
    },

    location: {
      type: locationSchema,
    },

    contact: {
      type: contactSchema,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    applicationSubmittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewNote: { type: String, trim: true, maxlength: 1000 },

    status: {
      type: String,
      enum: ["draft", "active", "suspended"],
      default: "draft",
      index: true,
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

storeProfileSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("StoreProfile", storeProfileSchema);
