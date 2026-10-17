const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, required: true, trim: true, maxlength: 80, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  actionUrl: { type: String, trim: true, maxlength: 500 },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedType: { type: String, trim: true },
  dedupeKey: { type: String, trim: true, maxlength: 240 },
  delivery: {
    email: { type: String, enum: ["skipped", "pending", "sent", "failed"], default: "skipped" },
    push: { type: String, enum: ["skipped", "pending", "sent", "failed"], default: "skipped" },
  },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, dedupeKey: 1 }, { unique: true, partialFilterExpression: { dedupeKey: { $type: "string" } } });

module.exports = mongoose.model("Notification", notificationSchema);
