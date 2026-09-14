// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  publicId: { type: String, required: true, trim: true },
  isPrimary: { type: Boolean, default: false },
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

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [imageSchema], default: [] },
  inventory: { type: Number, required: true, min: 0, default: 0 },
  location: { type: locationSchema },
  status: { type: String, enum: ["draft", "active", "outOfStock", "archived"], default: "draft", index: true },
}, { timestamps: true });

productSchema.index({ "location.coordinates": "2dsphere" });
productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Product", productSchema);
