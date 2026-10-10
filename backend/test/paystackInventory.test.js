const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidPaystackTransaction } = require("../src/controllers/paystackController");

const order = {
  _id: "66a000000000000000000001",
  buyerId: "66a000000000000000000002",
  paymentReference: "MAT-test-reference",
  total: 12500,
};

const transaction = {
  status: "success",
  reference: order.paymentReference,
  amount: 1250000,
  currency: "NGN",
  metadata: {
    orderId: order._id,
    buyerId: order.buyerId,
  },
};

test("accepts a successful transaction matching the order, buyer, amount and currency", () => {
  assert.equal(isValidPaystackTransaction(order, transaction, order.buyerId), true);
});

test("rejects a different payment reference", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, reference: "another-reference" }, order.buyerId), false);
});

test("rejects an amount mismatch", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, amount: 125000 }, order.buyerId), false);
});

test("rejects a currency mismatch", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, currency: "USD" }, order.buyerId), false);
});

test("rejects a metadata order mismatch", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, metadata: { ...transaction.metadata, orderId: "another-order" } }, order.buyerId), false);
});

test("rejects a metadata buyer mismatch", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, metadata: { ...transaction.metadata, buyerId: "another-buyer" } }, order.buyerId), false);
});

test("rejects a transaction that is not successful", () => {
  assert.equal(isValidPaystackTransaction(order, { ...transaction, status: "ongoing" }, order.buyerId), false);
});

test("rejects a different authenticated buyer", () => {
  assert.equal(isValidPaystackTransaction(order, transaction, "66a000000000000000000003"), false);
});
