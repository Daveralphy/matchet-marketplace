// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const RESERVED_USERNAMES = new Set(["admin", "administrator", "api", "help", "matchet", "moderator", "root", "seller", "support", "system", "provider"]);

const imageSchema = new mongoose.Schema({
  url: { type: String, trim: true },
  publicId: { type: String, trim: true },
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

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 100 },
  lastName: { type: String, required: true, trim: true, maxlength: 100 },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-z0-9_.]+$/,
    validate: { validator: (value) => !RESERVED_USERNAMES.has(value), message: "This username is reserved." },
  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, trim: true },
  avatar: { type: imageSchema },
  location: { type: locationSchema },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true, index: true },
  lastLoginAt: { type: Date },
}, { timestamps: true });

userSchema.index({ "location.coordinates": "2dsphere" });

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
