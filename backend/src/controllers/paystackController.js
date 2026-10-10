const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const PAYSTACK_API = "https://api.paystack.co";

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

async function initializePaystackPayment(req, res) {
  let order;
  try {
    if (!paystackConfigured()) {
      return res.status(503).json({
        success: false,
        code: "PAYSTACK_NOT_CONFIGURED",
        message: "Payments are not available yet. Please try again later.",
      });
    }

    const { items = [], deliveryMethod = "delivery", shippingAddress = {} } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }
    if (deliveryMethod !== "delivery") {
      return res.status(400).json({ success: false, message: "Only home delivery is currently available." });
    }
    if (!String(shippingAddress.addressLine1 || "").trim()) {
      return res.status(400).json({ success: false, message: "Please provide your delivery address before paying." });
    }
    if (!req.user.email) {
      return res.status(400).json({ success: false, message: "Add an email address to your account before paying." });
    }

    const normalizedItems = items.map((item) => ({
      productId: String(item.productId || ""),
      quantity: Number(item.quantity),
    }));
    if (normalizedItems.some((item) => !item.productId || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100)) {
      return res.status(400).json({ success: false, message: "One or more cart items are invalid. Refresh your cart and try again." });
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, status: "active" }).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));
    if (byId.size !== new Set(productIds).size) {
      return res.status(400).json({ success: false, message: "One or more products are no longer available." });
    }

    let subtotal = 0;
    let deliveryFee = 0;
    const orderItems = [];
    for (const input of normalizedItems) {
      const product = byId.get(input.productId);
      if (!product) return res.status(400).json({ success: false, message: "One or more products are no longer available." });
      if (String(product.currency || "NGN").toUpperCase() !== "NGN") {
        return res.status(400).json({ success: false, message: "Paystack checkout currently supports NGN products only. Please remove other currencies from your cart." });
      }
      if (Number(product.inventory || 0) < input.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}.` });
      }
      subtotal += Number(product.price || 0) * input.quantity;
      if (product.shipping?.homeDelivery) {
        deliveryFee += Number(product.shipping.deliveryFee || 0) * input.quantity;
      }
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
    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({ success: false, message: "The order total must be greater than zero." });
    }

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
      buyerId: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      currency: "NGN",
      deliveryMethod: "delivery",
      shippingAddress: address,
      paymentStatus: "pending",
      orderStatus: "pending",
      paymentReference: reference,
      statusHistory: [{ status: "pending", note: "Awaiting Paystack payment confirmation." }],
    });

    const clientUrl = String(process.env.CLIENT_URL || "").replace(/\/$/, "");
    if (!clientUrl) {
      await Order.deleteOne({ _id: order._id });
      return res.status(503).json({ success: false, message: "Checkout is not configured yet. Please try again later." });
    }

    let transaction;
    try {
      transaction = await paystackRequest("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
          email: req.user.email,
          amount: Math.round(total * 100),
          currency: "NGN",
          reference,
          callback_url: `${clientUrl}/checkout/verify`,
          metadata: {
            orderId: String(order._id),
            buyerId: String(req.user._id),
            custom_fields: [{ display_name: "Matchet order", variable_name: "order_id", value: String(order._id) }],
          },
        }),
      });
    } catch (error) {
      await Order.deleteOne({ _id: order._id });
      console.error("Paystack initialization failed:", error.message);
      return res.status(502).json({ success: false, message: "Paystack could not start your payment. No charge was made. Please try again." });
    }

    return res.status(201).json({
      success: true,
      orderId: String(order._id),
      reference: transaction.reference || reference,
      authorizationUrl: transaction.authorization_url,
    });
  } catch (error) {
    if (order?._id) await Order.deleteOne({ _id: order._id }).catch(() => {});
    console.error("Initialize Paystack payment failed:", error);
    return res.status(500).json({ success: false, message: "Unable to start checkout right now. Please try again." });
  }
}

async function verifyPaystackPayment(req, res) {
  try {
    if (!paystackConfigured()) {
      return res.status(503).json({ success: false, code: "PAYSTACK_NOT_CONFIGURED", message: "Payments are not available yet." });
    }
    const reference = String(req.params.reference || "").trim();
    if (!reference || reference.length > 100) {
      return res.status(400).json({ success: false, message: "A valid payment reference is required." });
    }

    const order = await Order.findOne({ buyerId: req.user._id, paymentReference: reference });
    if (!order) return res.status(404).json({ success: false, message: "We could not find an order for this payment." });
    if (order.paymentStatus === "paid") {
      return res.json({ success: true, paid: true, orderId: String(order._id), order });
    }

    let transaction;
    try {
      transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    } catch (error) {
      console.error("Paystack verification request failed:", error.message);
      return res.status(502).json({ success: false, message: "We could not verify your payment yet. Please retry in a moment." });
    }

    const expectedAmount = Math.round(Number(order.total) * 100);
    const isValidPayment = transaction.status === "success"
      && transaction.reference === reference
      && String(transaction.currency || "").toUpperCase() === "NGN"
      && Number(transaction.amount) === expectedAmount
      && String(transaction.metadata?.orderId || "") === String(order._id)
      && String(transaction.metadata?.buyerId || "") === String(req.user._id);

    if (!isValidPayment) {
      if (["failed", "abandoned"].includes(String(transaction.status || "").toLowerCase())) {
        order.paymentStatus = "failed";
        order.statusHistory.push({ status: "payment_failed", note: "Paystack reported that payment did not complete." });
        await order.save();
      }
      return res.status(402).json({ success: false, paid: false, message: "Paystack has not confirmed a successful payment for this order." });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.statusHistory.push({ status: "confirmed", note: "Payment verified by Paystack." });
    await order.save();
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    return res.json({ success: true, paid: true, orderId: String(order._id), order });
  } catch (error) {
    console.error("Verify Paystack payment failed:", error);
    return res.status(500).json({ success: false, message: "Unable to verify payment right now. Please try again." });
  }
}

module.exports = { initializePaystackPayment, verifyPaystackPayment };
