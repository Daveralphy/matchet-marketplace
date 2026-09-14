// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  publicId: { type: String, required: true, trim: true },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  type: { type: String, enum: ["fixed", "startingFrom", "customQuote"], required: true },
  amount: { type: Number, min: 0 },
  currency: { type: String, required: true, trim: true, uppercase: true, maxlength: 3 },
}, { _id: false });

const locationSchema = new mongoose.Schema({
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  coordinates: {
    type: { type: String, enum: ["Point"] },
    coordinates: {
      type: [Number],
      validate: { validator: (value) => value.length === 2, message: "Coordinates must contain longitude and latitude." },
    },
  },
}, { _id: false });

const availabilitySchema = new mongoose.Schema({}, { strict: false, _id: false });

const serviceSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, required: true, trim: true, index: true },
  pricing: { type: pricingSchema, required: true },
  images: { type: [imageSchema], default: [] },
  location: { type: locationSchema },
  availability: { type: availabilitySchema },
  status: { type: String, enum: ["draft", "active", "paused", "archived"], default: "draft", index: true },
}, { timestamps: true });

serviceSchema.index({ "location.coordinates": "2dsphere" });
serviceSchema.index({ providerId: 1, status: 1 });
serviceSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Service", serviceSchema);
