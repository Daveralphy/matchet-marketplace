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


test("concurrent reservations cannot sell more units than inventory", async (t) => {
  const Order = require("../src/models/Order");
  const Product = require("../src/models/Product");
  const { reserveInventory } = require("../src/controllers/paystackController");

  const originals = {
    orderFindOneAndUpdate: Order.findOneAndUpdate,
    orderFindById: Order.findById,
    orderUpdateOne: Order.updateOne,
    productFindOneAndUpdate: Product.findOneAndUpdate,
    productUpdateOne: Product.updateOne,
  };
  t.after(() => {
    Order.findOneAndUpdate = originals.orderFindOneAndUpdate;
    Order.findById = originals.orderFindById;
    Order.updateOne = originals.orderUpdateOne;
    Product.findOneAndUpdate = originals.productFindOneAndUpdate;
    Product.updateOne = originals.productUpdateOne;
  });

  const stock = new Map([["product-1", { _id: "product-1", inventory: 1, status: "active" }]]);
  const orders = new Map([
    ["order-1", { _id: "order-1", paymentStatus: "pending", inventoryReservationStatus: "none", items: [{ productId: "product-1", quantity: 1 }], statusHistory: [] }],
    ["order-2", { _id: "order-2", paymentStatus: "pending", inventoryReservationStatus: "none", items: [{ productId: "product-1", quantity: 1 }], statusHistory: [] }],
  ]);

  Order.findOneAndUpdate = async (filter, update) => {
    const order = orders.get(String(filter._id));
    if (!order || !filter.paymentStatus.$in.includes(order.paymentStatus) || !filter.inventoryReservationStatus.$in.includes(order.inventoryReservationStatus)) return null;
    Object.assign(order, update.$set || {});
    return { ...order, items: order.items.map((item) => ({ ...item })) };
  };
  Order.findById = (id) => ({ lean: async () => ({ ...orders.get(String(id)), items: orders.get(String(id)).items.map((item) => ({ ...item })) }) });
  Order.updateOne = async (filter, update) => {
    const order = orders.get(String(filter._id));
    if (!order) return { modifiedCount: 0 };
    if (filter.inventoryReservationStatus && order.inventoryReservationStatus !== filter.inventoryReservationStatus) return { modifiedCount: 0 };
    if (filter.paymentStatus?.$in && !filter.paymentStatus.$in.includes(order.paymentStatus)) return { modifiedCount: 0 };
    Object.assign(order, update.$set || {});
    if (update.$push?.statusHistory) order.statusHistory.push(update.$push.statusHistory);
    return { modifiedCount: 1 };
  };
  Product.findOneAndUpdate = async (filter, update) => {
    const product = stock.get(String(filter._id));
    if (!product || product.status !== filter.status || product.inventory < filter.inventory.$gte) return null;
    product.inventory += update.$inc.inventory;
    return { ...product };
  };
  Product.updateOne = async (filter, update) => {
    const product = stock.get(String(filter._id));
    if (!product) return { modifiedCount: 0 };
    if (filter.status && product.status !== filter.status) return { modifiedCount: 0 };
    if (filter.inventory === 0 && product.inventory !== 0) return { modifiedCount: 0 };
    if (filter.inventory?.$gt !== undefined && !(product.inventory > filter.inventory.$gt)) return { modifiedCount: 0 };
    if (update.$inc) product.inventory += update.$inc.inventory;
    if (update.$set?.status) product.status = update.$set.status;
    return { modifiedCount: 1 };
  };

  const outcomes = await Promise.all([
    reserveInventory(orders.get("order-1")),
    reserveInventory(orders.get("order-2")),
  ]);

  assert.equal(outcomes.filter(Boolean).length, 1);
  assert.equal(stock.get("product-1").inventory, 0);
  assert.equal(["reserved", "released"].includes(orders.get("order-1").inventoryReservationStatus), true);
  assert.equal(["reserved", "released"].includes(orders.get("order-2").inventoryReservationStatus), true);
  assert.equal(orders.get("order-1").inventoryReservationStatus === "reserved" || orders.get("order-2").inventoryReservationStatus === "reserved", true);
});


test("duplicate successful payment confirmation is idempotent for an already-paid order", async (t) => {
  const Order = require("../src/models/Order");
  const Product = require("../src/models/Product");
  const { finalizeSuccessfulPayment } = require("../src/controllers/paystackController");
  const alreadyPaidOrder = {
    ...order,
    paymentStatus: "paid",
    orderStatus: "confirmed",
    inventoryReservationStatus: "consumed",
  };
  const originalFindById = Order.findById;
  const originalProductFindOneAndUpdate = Product.findOneAndUpdate;
  let inventoryWrites = 0;

  t.after(() => {
    Order.findById = originalFindById;
    Product.findOneAndUpdate = originalProductFindOneAndUpdate;
  });

  Order.findById = async () => alreadyPaidOrder;
  Product.findOneAndUpdate = async () => {
    inventoryWrites += 1;
    throw new Error("Duplicate confirmation must not change inventory.");
  };

  const result = await finalizeSuccessfulPayment(alreadyPaidOrder, transaction, order.buyerId);

  assert.equal(result.valid, true);
  assert.equal(result.paid, true);
  assert.equal(result.order, alreadyPaidOrder);
  assert.equal(inventoryWrites, 0);
});


test("inventory release reports failure and flags review when final state transition loses a race", async (t) => {
  const Order = require("../src/models/Order");
  const Product = require("../src/models/Product");
  const { releaseInventory } = require("../src/controllers/paystackController");
  const originalFindOneAndUpdate = Order.findOneAndUpdate;
  const originalUpdateOne = Order.updateOne;
  const originalProductUpdateOne = Product.updateOne;
  const updates = [];
  const claimed = {
    _id: "order-release-race",
    paymentStatus: "pending",
    inventoryReservationStatus: "releasing",
    items: [{ productId: "product-release-race", quantity: 2 }],
  };

  t.after(() => {
    Order.findOneAndUpdate = originalFindOneAndUpdate;
    Order.updateOne = originalUpdateOne;
    Product.updateOne = originalProductUpdateOne;
  });

  Order.findOneAndUpdate = async () => claimed;
  Product.updateOne = async () => ({ modifiedCount: 1 });
  Order.updateOne = async (filter, update) => {
    updates.push({ filter, update });
    if (update.$set?.inventoryReservationStatus === "released") return { modifiedCount: 0 };
    return { modifiedCount: 1 };
  };

  const result = await releaseInventory(claimed, "test release");

  assert.equal(result, false);
  assert.equal(updates.some(({ update }) => update.$set?.requiresManualReview === true), true);
});
