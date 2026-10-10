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


test("seller settlement excludes unresolved orders and reserves pending payouts from availability", async (t) => {
  const StoreProfile = require("../src/models/StoreProfile");
  const providerController = require("../src/controllers/provider.controller");
  const originals = {
    orderFind: Order.find,
    orderAggregate: Order.aggregate,
    payoutFind: Payout.find,
    storeFindOne: StoreProfile.findOne,
  };
  const sellerId = new mongoose.Types.ObjectId();
  let payoutFilter;
  let settlementPipeline;

  t.after(() => {
    Order.find = originals.orderFind;
    Order.aggregate = originals.orderAggregate;
    Payout.find = originals.payoutFind;
    StoreProfile.findOne = originals.storeFindOne;
  });

  Order.find = () => ({
    sort() { return this; },
    limit() { return this; },
    lean: async () => [],
  });
  Payout.find = (filter) => {
    payoutFilter = filter;
    return {
      sort() { return this; },
      lean: async () => [
        { _id: "completed-payout", amount: 200, status: "completed", createdAt: new Date() },
        { _id: "pending-payout", amount: 100, status: "pending", createdAt: new Date() },
      ],
    };
  };
  StoreProfile.findOne = () => ({ lean: async () => null });
  Order.aggregate = async (pipeline) => {
    settlementPipeline = pipeline;
    return [{ total: 1200, orderIds: ["delivered-order"] }];
  };

  let response;
  const res = { json(payload) { response = payload; return payload; } };
  await providerController.getSellerEarnings({ user: { _id: sellerId } }, res);

  assert.equal(payoutFilter.recipientType, "seller");
  assert.equal(payoutFilter.providerId, sellerId);
  assert.equal(settlementPipeline[0].$match.paymentStatus, "paid");
  assert.equal(settlementPipeline[0].$match.orderStatus, "delivered");
  assert.deepEqual(settlementPipeline[0].$match.requiresManualReview, { $ne: true });
  assert.equal(response.success, true);
  assert.equal(response.data.kpis.settlementEligibleOrders, 1);
  assert.equal(response.data.kpis.paidOut, 200);
  assert.equal(response.data.kpis.pendingPayout, 100);
  assert.equal(response.data.kpis.availableForSettlement, 900);
});
