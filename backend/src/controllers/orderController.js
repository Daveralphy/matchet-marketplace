const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Review = require("../models/Review");


async function createBuyerOrder(req,res){
  try {
    // Keep order creation disabled until a real payment provider is integrated and verified.
    if (process.env.PAYMENTS_ENABLED !== "true") return res.status(503).json({success:false,message:"Online payment is not configured yet. No order has been created. Please try again when Matchet payments are available.",code:"PAYMENTS_NOT_CONFIGURED"});
    const { items = [], deliveryMethod = "delivery", shippingAddress = {} } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({success:false,message:"Your cart is empty."});
    if (!["delivery","pickup"].includes(deliveryMethod)) return res.status(400).json({success:false,message:"Choose a valid delivery method."});
    if (deliveryMethod === "pickup") return res.status(409).json({success:false,message:"Pickup is not available yet because no confirmed pickup stations are configured. Please choose home delivery."});

    const productIds = items.map((item) => item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds }, status: "active" }).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));
    const orderItems = [];
    let subtotal = 0;
    let deliveryFee = 0;
    let currency = null;

    for (const input of items) {
      const product = byId.get(String(input.productId));
      const quantity = Math.max(1, Number(input.quantity || 1));
      if (!product) return res.status(400).json({success:false,message:"One or more products are no longer available."});
      if (product.inventory < quantity) return res.status(400).json({success:false,message:`Not enough stock for ${product.name}.`});
      const productCurrency = String(product.currency || "NGN").toUpperCase();
      if (currency && currency !== productCurrency) return res.status(400).json({success:false,message:"Your cart contains products in different currencies. Please place separate orders for each currency."});
      currency = productCurrency;
      subtotal += Number(product.price || 0) * quantity;
      if (deliveryMethod === "delivery") deliveryFee += Number(product.shipping?.homeDelivery ? product.shipping?.deliveryFee || 0 : 0) * quantity;
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        nameSnapshot: product.name,
        priceSnapshot: Number(product.price || 0),
        quantity,
        imageSnapshot: product.images?.find((image) => image.isPrimary)?.url || product.images?.[0]?.url || "",
      });
    }

    if (deliveryMethod === "delivery" && !String(shippingAddress.addressLine1 || "").trim()) {
      return res.status(400).json({success:false,message:"Please provide your delivery address before placing the order."});
    }

    const address = {
      firstName: shippingAddress.firstName || req.user.firstName || "",
      lastName: shippingAddress.lastName || req.user.lastName || "",
      phone: shippingAddress.phone || req.user.phone || "",
      addressLine1: shippingAddress.addressLine1 || req.user.location?.addressLine1 || "",
      addressLine2: shippingAddress.addressLine2 || "",
      city: shippingAddress.city || req.user.location?.city || "",
      state: shippingAddress.state || req.user.location?.state || "",
      country: shippingAddress.country || req.user.location?.country || "",
      postalCode: shippingAddress.postalCode || "",
    };

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      currency: currency || "NGN",
      deliveryMethod,
      pickupStation: undefined,
      shippingAddress: address,
      statusHistory: [{status:"pending",note: deliveryMethod === "pickup" ? "Order will be routed to a nearby pickup station." : "Order placed for home delivery."}],
    });

    await Cart.findOneAndUpdate({userId:req.user._id},{items:[]});
    return res.status(201).json({success:true,order});
  } catch(error){
    console.error("Create buyer order failed:",error);
    return res.status(500).json({success:false,message:"Unable to place your order right now."});
  }
}

async function listBuyerOrders(req,res){
  try {
    const orders=await Order.find({buyerId:req.user._id}).sort({createdAt:-1}).lean();
    return res.json({success:true,orders});
  } catch(error){ console.error("List buyer orders failed:",error); return res.status(500).json({success:false,message:"Unable to load your orders."}); }
}

async function listBuyerOrderReviews(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyerId: req.user._id }).select("items orderStatus paymentStatus").lean();
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    const productIds = [...new Set((order.items || []).map((item) => String(item.productId)))];
    const reviews = await Review.find({ reviewerId: req.user._id, productId: { $in: productIds } }).select("productId rating comment createdAt").lean();
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unable to load reviews for this order." });
  }
}

async function createBuyerOrderReview(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyerId: req.user._id }).lean();
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    if (order.paymentStatus !== "paid" || order.orderStatus !== "delivered") {
      return res.status(409).json({ success: false, message: "You can review products after the paid order has been delivered." });
    }
    const productId = String(req.body?.productId || "");
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Choose a valid product from this order." });
    }
    const item = (order.items || []).find((entry) => String(entry.productId) === productId);
    if (!item) return res.status(403).json({ success: false, message: "You can only review products included in this order." });
    const rating = Number(req.body?.rating);
    const comment = String(req.body?.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Choose a star rating from 1 to 5." });
    }
    if (comment.length > 2000) return res.status(400).json({ success: false, message: "Your review must be 2,000 characters or fewer." });
    const existing = await Review.findOne({ reviewerId: req.user._id, productId }).select("_id").lean();
    if (existing) return res.status(409).json({ success: false, message: "You have already reviewed this product." });
    const review = await Review.create({ reviewerId: req.user._id, productId, rating, comment, status: "published" });
    return res.status(201).json({ success: true, review: { id: review._id, productId: String(review.productId), rating: review.rating, comment: review.comment, createdAt: review.createdAt } });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "You have already reviewed this product." });
    console.error("Buyer order review failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your review right now." });
  }
}

async function getBuyerOrder(req,res){
  try {
    const order=await Order.findOne({_id:req.params.id,buyerId:req.user._id}).lean();
    if(!order)return res.status(404).json({success:false,message:"Order not found."});
    return res.json({success:true,order});
  } catch(error){return res.status(400).json({success:false,message:"Invalid order."});}
}
module.exports={listBuyerOrders,getBuyerOrder,createBuyerOrder,listBuyerOrderReviews,createBuyerOrderReview};
