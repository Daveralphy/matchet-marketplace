const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const PAYSTACK_API = "https://api.paystack.co";
const RESERVATION_MINUTES = 30;

function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

async function paystackRequest(path, options = {}) {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status !== true) {
    const error = new Error(payload.message || "Paystack could not process this request.");
    error.status = response.status;
    throw error;
  }
  return payload.data;
}

function reservationExpiry() {
  return new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);
}

function isValidPaystackTransaction(order, transaction, buyerId) {
  return transaction?.status === "success"
    && String(transaction.reference || "") === String(order.paymentReference || "")
    && String(transaction.currency || "").toUpperCase() === "NGN"
    && Number(transaction.amount) === Math.round(Number(order.total) * 100)
    && String(transaction.metadata?.orderId || "") === String(order._id)
    && String(transaction.metadata?.buyerId || "") === String(order.buyerId)
    && (!buyerId || String(order.buyerId) === String(buyerId));
}

// Each stock decrement is conditional, so two simultaneous checkouts cannot reserve
// the same units. The order state acts as a per-order lock for duplicate callbacks.
async function reserveInventory(order) {
  const claimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      paymentStatus: { $in: ["pending", "failed"] },
      inventoryReservationStatus: { $in: ["none", "released"] },
    },
    {
      $set: {
        inventoryReservationStatus: "reserving",
        inventoryReservationExpiresAt: reservationExpiry(),
      },
    },
    { new: true },
  );

  if (!claimed) {
    const current = await Order.findById(order._id).lean();
    return current?.inventoryReservationStatus === "reserved";
  }

  const reserved = [];
  for (const item of claimed.items) {
    const product = await Product.findOneAndUpdate(
      { _id: item.productId, status: "active", inventory: { $gte: item.quantity } },
      { $inc: { inventory: -item.quantity } },
      { new: true },
    );
    if (!product) {
      for (const prior of reserved) {
        await Product.updateOne({ _id: prior.productId }, { $inc: { inventory: prior.quantity } });
      }
      await Order.updateOne(
        { _id: claimed._id, inventoryReservationStatus: "reserving" },
        {
          $set: { inventoryReservationStatus: "released" },
          $push: { statusHistory: { status: "inventory_unavailable", note: "Stock reservation failed; no inventory remains reserved for this checkout." } },
        },
      );
      return false;
    }
    reserved.push({ productId: item.productId, quantity: item.quantity });
  }

  const result = await Order.updateOne(
    { _id: claimed._id, paymentStatus: { $in: ["pending", "failed"] }, inventoryReservationStatus: "reserving" },
    { $set: { inventoryReservationStatus: "reserved" } },
  );
  if (!result.modifiedCount) {
    // A competing state transition occurred. Restore this reservation before returning.
    for (const item of reserved) {
      await Product.updateOne({ _id: item.productId }, { $inc: { inventory: item.quantity } });
    }
    return false;
  }
  return true;
}

async function releaseInventory(order, note) {
  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $in: ["pending", "failed"] }, inventoryReservationStatus: "reserved" },
    { $set: { inventoryReservationStatus: "reserving" } },
    { new: true },
  );
  if (!claimed) return false;

  try {
    for (const item of claimed.items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { inventory: item.quantity } });
    }
    await Order.updateOne(
      { _id: claimed._id, inventoryReservationStatus: "reserving", paymentStatus: { $in: ["pending", "failed"] } },
      {
        $set: { inventoryReservationStatus: "released" },
        $push: { statusHistory: { status: "inventory_released", note } },
      },
    );
    return true;
  } catch (error) {
    // Keep the order in the intermediate state rather than risk restoring the same
    // stock twice. This requires operational review if a database write fails midway.
    await Order.updateOne(
      { _id: claimed._id, inventoryReservationStatus: "reserving" },
      { $set: { requiresManualReview: true } },
    ).catch(() => {});
    throw error;
  }
}

async function markPaymentFailed(order, note) {
  await releaseInventory(order, note);
  await Order.updateOne(
    { _id: order._id, paymentStatus: { $in: ["pending", "failed"] }, inventoryReservationStatus: { $in: ["none", "released"] } },
    {
      $set: { paymentStatus: "failed" },
      $push: { statusHistory: { status: "payment_failed", note } },
    },
  );
}

async function finalizeSuccessfulPayment(order, transaction, buyerId) {
  if (!isValidPaystackTransaction(order, transaction, buyerId)) return { valid: false, paid: false };

  let current = await Order.findById(order._id);
  if (!current) return { valid: false, paid: false };
  if (current.paymentStatus === "paid") return { valid: true, paid: true, order: current };

  let hasReservation = current.inventoryReservationStatus === "reserved";
  if (!hasReservation) {
    hasReservation = await reserveInventory(current);
    current = await Order.findById(order._id);
  }

  if (!hasReservation) {
    // The charge is real even if another buyer has taken the released stock.
    // Record the payment, but do not confirm/fulfil an unstocked order.
    const paidForReview = await Order.findOneAndUpdate(
      { _id: order._id, paymentStatus: { $in: ["pending", "failed"] }, inventoryReservationStatus: { $in: ["none", "released"] } },
      {
        $set: { paymentStatus: "paid", requiresManualReview: true },
        $push: { statusHistory: { status: "paid_inventory_unavailable", note: "Payment succeeded after stock could not be reserved. Do not fulfil automatically; arrange a refund or manual resolution." } },
      },
      { new: true },
    );
    if (paidForReview) await Cart.findOneAndUpdate({ userId: paidForReview.buyerId }, { items: [] });
    const latest = paidForReview || await Order.findById(order._id);
    return { valid: true, paid: latest?.paymentStatus === "paid", requiresManualReview: true, order: latest };
  }

  const paidOrder = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $in: ["pending", "failed"] }, inventoryReservationStatus: "reserved" },
    {
      $set: { paymentStatus: "paid", orderStatus: "confirmed", inventoryReservationStatus: "consumed", requiresManualReview: false },
      $push: { statusHistory: { status: "confirmed", note: "Payment verified by Paystack; reserved inventory committed." } },
    },
    { new: true },
  );

  if (paidOrder) {
    await Cart.findOneAndUpdate({ userId: paidOrder.buyerId }, { items: [] });
    return { valid: true, paid: true, order: paidOrder };
  }

  const latest = await Order.findById(order._id);
  return { valid: true, paid: latest?.paymentStatus === "paid", order: latest };
}

async function expireStaleReservations() {
  if (!paystackConfigured()) return;
  const stale = await Order.find({
    paymentStatus: "pending",
    inventoryReservationStatus: "reserved",
    inventoryReservationExpiresAt: { $lte: new Date() },
  }).sort({ inventoryReservationExpiresAt: 1 }).limit(20);

  for (const order of stale) {
    try {
      const transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(order.paymentReference)}`);
      if (transaction.status === "success") {
        await finalizeSuccessfulPayment(order, transaction, order.buyerId);
      } else if (["failed", "abandoned", "reversed", "pending", "ongoing"].includes(String(transaction.status || "").toLowerCase())) {
        await markPaymentFailed(order, "The checkout reservation expired before Paystack confirmed payment.");
      }
    } catch (error) {
      // A verification outage is not evidence of failure. Leave the reservation intact.
      console.warn("Could not safely expire checkout reservation:", String(order._id), error.message);
    }
  }
}

async function initializePaystackPayment(req, res) {
  let order;
  try {
    if (!paystackConfigured()) {
      return res.status(503).json({ success: false, code: "PAYSTACK_NOT_CONFIGURED", message: "Payments are not available yet. Please try again later." });
    }

    await expireStaleReservations();
    const { items = [], deliveryMethod = "delivery", shippingAddress = {} } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ success: false, message: "Your cart is empty." });
    if (deliveryMethod !== "delivery") return res.status(400).json({ success: false, message: "Only home delivery is currently available." });
    if (!String(shippingAddress.addressLine1 || "").trim()) return res.status(400).json({ success: false, message: "Please provide your delivery address before paying." });
    if (!req.user.email) return res.status(400).json({ success: false, message: "Add an email address to your account before paying." });

    const requestedItems = items.map((item) => ({ productId: String(item.productId || ""), quantity: Number(item.quantity) }));
    if (requestedItems.some((item) => !/^[a-f\d]{24}$/i.test(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
      return res.status(400).json({ success: false, message: "One or more cart items are invalid. Refresh your cart and try again." });
    }
    const quantityByProduct = new Map();
    for (const item of requestedItems) quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) || 0) + item.quantity);
    const normalizedItems = Array.from(quantityByProduct, ([productId, quantity]) => ({ productId, quantity }));
    if (normalizedItems.some((item) => item.quantity > 100)) return res.status(400).json({ success: false, message: "A product quantity exceeds the checkout limit." });

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, status: "active" }).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));
    if (byId.size !== productIds.length) return res.status(400).json({ success: false, message: "One or more products are no longer available." });

    let subtotal = 0;
    let deliveryFee = 0;
    const orderItems = [];
    for (const input of normalizedItems) {
      const product = byId.get(input.productId);
      if (String(product.currency || "NGN").toUpperCase() !== "NGN") return res.status(400).json({ success: false, message: "Paystack checkout currently supports NGN products only. Please remove other currencies from your cart." });
      if (Number(product.inventory || 0) < input.quantity) return res.status(409).json({ success: false, message: `Not enough stock for ${product.name}.` });
      if (product.shipping?.homeDelivery === false) return res.status(400).json({ success: false, message: `${product.name} is not available for home delivery. Pickup is not available yet.` });
      subtotal += Number(product.price || 0) * input.quantity;
      deliveryFee += Number(product.shipping?.deliveryFee || 0) * input.quantity;
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        nameSnapshot: product.name,
        priceSnapshot: Number(product.price || 0),
        quantity: input.quantity,
        imageSnapshot: product.images?.find((image) => image.isPrimary)?.url || product.images?.[0]?.url || "",
      });
    }

    const total = Math.round((subtotal + deliveryFee) * 100) / 100;
    if (!Number.isFinite(total) || total <= 0) return res.status(400).json({ success: false, message: "The order total must be greater than zero." });

    const address = {
      firstName: shippingAddress.firstName || req.user.firstName || "",
      lastName: shippingAddress.lastName || req.user.lastName || "",
      phone: shippingAddress.phone || req.user.phone || "",
      addressLine1: String(shippingAddress.addressLine1).trim(),
      addressLine2: shippingAddress.addressLine2 || "",
      city: shippingAddress.city || req.user.location?.city || "",
      state: shippingAddress.state || req.user.location?.state || "",
      country: shippingAddress.country || req.user.location?.country || "Nigeria",
      postalCode: shippingAddress.postalCode || "",
    };

    const reference = `MAT-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    order = await Order.create({
      buyerId: req.user._id, items: orderItems, subtotal, deliveryFee, total, currency: "NGN",
      deliveryMethod: "delivery", shippingAddress: address, paymentStatus: "pending",
      orderStatus: "pending", paymentReference: reference,
      inventoryReservationStatus: "none",
      statusHistory: [{ status: "pending", note: "Awaiting Paystack payment confirmation." }],
    });

    if (!(await reserveInventory(order))) {
      await Order.updateOne({ _id: order._id }, { $set: { paymentStatus: "failed" }, $push: { statusHistory: { status: "payment_not_started", note: "Inventory changed before checkout could reserve stock. No payment was initialized." } } });
      return res.status(409).json({ success: false, message: "Stock changed while you were checking out. Refresh your cart and try again." });
    }
    order = await Order.findById(order._id);

    const clientUrl = String(process.env.CLIENT_URL || "").replace(/\/$/, "");
    if (!clientUrl) {
      await markPaymentFailed(order, "Checkout configuration is missing; inventory was released.");
      return res.status(503).json({ success: false, message: "Checkout is not configured yet. Please try again later." });
    }

    let transaction;
    try {
      transaction = await paystackRequest("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
          email: req.user.email, amount: Math.round(total * 100), currency: "NGN", reference,
          callback_url: `${clientUrl}/checkout/verify`,
          metadata: { orderId: String(order._id), buyerId: String(req.user._id), custom_fields: [{ display_name: "Matchet order", variable_name: "order_id", value: String(order._id) }] },
        }),
      });
      if (!transaction.authorization_url || transaction.reference !== reference) throw new Error("Paystack returned an invalid checkout response.");
    } catch (error) {
      await markPaymentFailed(order, "Paystack initialization failed; inventory was released.");
      console.error("Paystack initialization failed:", error.message);
      return res.status(502).json({ success: false, message: "Paystack could not start your payment. Please try again. If you were charged, contact support with your order reference." });
    }

    return res.status(201).json({ success: true, orderId: String(order._id), reference: transaction.reference, authorizationUrl: transaction.authorization_url });
  } catch (error) {
    console.error("Initialize Paystack payment failed:", error);
    if (order?._id) {
      await Order.updateOne({ _id: order._id }, { $set: { requiresManualReview: true } }).catch(() => {});
    }
    return res.status(500).json({ success: false, message: "Unable to start checkout right now. Please try again." });
  }
}

async function verifyPaystackPayment(req, res) {
  try {
    if (!paystackConfigured()) return res.status(503).json({ success: false, code: "PAYSTACK_NOT_CONFIGURED", message: "Payments are not available yet." });
    const reference = String(req.params.reference || "").trim();
    if (!reference || reference.length > 100) return res.status(400).json({ success: false, message: "A valid payment reference is required." });

    let order = await Order.findOne({ buyerId: req.user._id, paymentReference: reference });
    if (!order) return res.status(404).json({ success: false, message: "We could not find an order for this payment." });
    if (order.paymentStatus === "paid") return res.json({ success: true, paid: true, requiresManualReview: Boolean(order.requiresManualReview), orderId: String(order._id), order });

    let transaction;
    try {
      transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    } catch (error) {
      console.error("Paystack verification request failed:", error.message);
      return res.status(502).json({ success: false, message: "We could not verify your payment yet. Please retry in a moment." });
    }

    if (transaction.status === "success") {
      const result = await finalizeSuccessfulPayment(order, transaction, req.user._id);
      order = result.order || await Order.findById(order._id);
      if (!result.valid || !result.paid) return res.status(402).json({ success: false, paid: false, message: "Paystack has not confirmed a successful payment for this order." });
      return res.json({ success: true, paid: true, requiresManualReview: Boolean(result.requiresManualReview || order.requiresManualReview), orderId: String(order._id), order });
    }

    if (["failed", "abandoned", "reversed"].includes(String(transaction.status || "").toLowerCase())) {
      await markPaymentFailed(order, "Paystack reported that payment did not complete.");
    }
    order = await Order.findById(order._id);
    return res.status(402).json({ success: true, paid: false, paymentStatus: order?.paymentStatus || "pending", message: "Paystack has not confirmed a successful payment for this order." });
  } catch (error) {
    console.error("Verify Paystack payment failed:", error);
    return res.status(500).json({ success: false, message: "Unable to verify payment right now. Please try again." });
  }
}

async function handlePaystackWebhook(req, res) {
  const signature = req.headers["x-paystack-signature"];
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature || !req.rawBody) return res.status(400).json({ success: false, message: "Invalid webhook request." });

  const expected = crypto.createHmac("sha512", secret).update(req.rawBody).digest("hex");
  const suppliedBuffer = Buffer.from(String(signature));
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    return res.status(401).json({ success: false, message: "Webhook signature verification failed." });
  }

  try {
    const event = req.body;
    if (event?.event !== "charge.success" || !event?.data?.reference) return res.status(200).json({ received: true });
    const transaction = event.data;
    const order = await Order.findOne({ paymentReference: String(transaction.reference) });
    if (!order || order.paymentStatus === "paid") return res.status(200).json({ received: true });

    const result = await finalizeSuccessfulPayment(order, transaction, order.buyerId);
    if (!result.valid) {
      console.error("Paystack webhook did not match order:", String(order._id));
      return res.status(200).json({ received: true });
    }
    if (!result.paid) {
      // Ask Paystack to retry if another callback currently owns the reservation transition.
      return res.status(500).json({ success: false, message: "Payment confirmation is still being processed." });
    }
    if (result.requiresManualReview) console.error("Paid order requires inventory review:", String(order._id));
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Paystack webhook handling failed:", error);
    return res.status(500).json({ success: false, message: "Webhook processing failed." });
  }
}

module.exports = {
  initializePaystackPayment,
  verifyPaystackPayment,
  handlePaystackWebhook,
  reserveInventory,
  releaseInventory,
  finalizeSuccessfulPayment,
  isValidPaystackTransaction,
};
