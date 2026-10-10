const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Order = require("../src/models/Order");
const Payout = require("../src/models/Payout");
const Message = require("../src/models/Message");

test("orders default to an unreserved inventory state and no manual review", () => {
  const order = new Order({
    buyerId: new mongoose.Types.ObjectId(),
    items: [{
      productId: new mongoose.Types.ObjectId(),
      sellerId: new mongoose.Types.ObjectId(),
      nameSnapshot: "Test product",
      priceSnapshot: 100,
      quantity: 1,
    }],
    subtotal: 100,
    deliveryFee: 0,
    total: 100,
    shippingAddress: { addressLine1: "Test address" },
  });

  assert.equal(order.inventoryReservationStatus, "none");
  assert.equal(order.inventoryRestockStatus, "none");
  assert.equal(order.requiresManualReview, false);
  assert.equal(order.paymentStatus, "pending");
});

test("payouts keep seller and provider ledgers distinguishable", () => {
  const providerPayout = new Payout({
    providerId: new mongoose.Types.ObjectId(),
    amount: 100,
    currency: "NGN",
  });
  const sellerPayout = new Payout({
    providerId: new mongoose.Types.ObjectId(),
    recipientType: "seller",
    amount: 100,
    currency: "NGN",
  });

  assert.equal(providerPayout.recipientType, "provider");
  assert.equal(sellerPayout.recipientType, "seller");
});

test("messages cannot be sent to the sender's own account", async () => {
  const userId = new mongoose.Types.ObjectId();
  const message = new Message({
    conversationId: [String(userId), "other-user"].sort().join(":"),
    senderId: userId,
    receiverId: userId,
    content: "This should be rejected",
  });

  await assert.rejects(message.validate(), /receiverId/);
});
