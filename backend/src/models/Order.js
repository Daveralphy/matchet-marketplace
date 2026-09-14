// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nameSnapshot: { type: String, required: true, trim: true },
  priceSnapshot: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  imageSnapshot: { type: String, trim: true },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  addressLine1: { type: String, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  postalCode: { type: String, trim: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: { validator: (value) => value.length > 0, message: "An order must contain at least one item." } },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
  orderStatus: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "pending", index: true },
  shippingAddress: { type: addressSchema, required: true },
  paymentReference: { type: String, trim: true, index: true, sparse: true },
}, { timestamps: true });

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ "items.sellerId": 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
