const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recipientType: { type: String, enum: ["provider", "seller"], default: "provider", index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, trim: true, uppercase: true, maxlength: 3 },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
    index: true,
  },
  method: {
    bankName: { type: String, trim: true },
    accountLast4: { type: String, trim: true, maxlength: 4 },
  },
  scheduledFor: { type: Date },
  paidAt: { type: Date },
}, { timestamps: true });

payoutSchema.index({ providerId: 1, createdAt: -1 });
payoutSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model("Payout", payoutSchema);
