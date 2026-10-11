// Created by: Raphael Daveal
// Edited by: Raphael Daveal

const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  publicId: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
}, { _id: false });

const orderCardItemSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  image: { type: String, trim: true },
  quantity: { type: Number, min: 1 },
  unitPrice: { type: Number, min: 0 },
}, { _id: false });

const orderCardSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  items: { type: [orderCardItemSchema], default: [] },
  total: { type: Number, min: 0 },
  currency: { type: String, trim: true, uppercase: true, maxlength: 3 },
  status: { type: String, trim: true },
  placedAt: { type: Date },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true, trim: true },
  sourceRef: { type: String, trim: true },
  orderCard: { type: orderCardSchema, default: undefined },
  archivedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hiddenFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  content: { type: String, trim: true, maxlength: 5000 },
  attachments: { type: [attachmentSchema], default: [] },
  readAt: { type: Date },
}, { timestamps: true });

messageSchema.pre("validate", function validateMessage() {
  const hasContent = typeof this.content === "string" && this.content.trim().length > 0;
  const hasAttachments = Array.isArray(this.attachments) && this.attachments.length > 0;

  if (!hasContent && !hasAttachments) {
    this.invalidate("content", "A message must contain text or at least one attachment.");
  }

  if (this.senderId && this.receiverId && this.senderId.equals(this.receiverId)) {
    this.invalidate("receiverId", "A message cannot be sent to the same user.");
  }
});

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, readAt: 1 });
messageSchema.index({ sourceRef: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Message", messageSchema);
