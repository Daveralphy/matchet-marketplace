const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const StoreProfile = require("../models/StoreProfile");

async function approvedSellerIds() {
  const stores = await StoreProfile.find({ status: "active", verificationStatus: "verified" }).select("userId").lean();
  return stores.map((store) => store.userId).filter(Boolean);
}

async function getApprovedProduct(productId) {
  if (!mongoose.isValidObjectId(productId)) return null;
  const sellerIds = await approvedSellerIds();
  return Product.findOne({ _id: productId, status: "active", sellerId: { $in: sellerIds } }).lean();
}

function mapProduct(product, quantity) {
  const images = Array.isArray(product.images) ? product.images : [];
  const image = images.find((item) => item?.isPrimary)?.url || images[0]?.url || "";
  return {
    id: product._id.toString(), type: "product", title: product.name, name: product.name,
    description: product.description || "", category: product.category || "",
    price: product.price, priceValue: Number(product.price || 0), currency: product.currency || "NGN", shipping: product.shipping || { homeDelivery: true, pickup: true, deliveryFee: 0 },
    inventory: Number(product.inventory || 0), stockCount: Number(product.inventory || 0),
    availability: product.inventory > 0 ? "In stock" : "Out of stock", status: product.status,
    image, images, quantity,
  };
}

async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).lean();
    if (!cart?.items?.length) return res.json({ success: true, items: [] });
    const sellerIds = await approvedSellerIds();
    const products = await Product.find({
      _id: { $in: cart.items.map((item) => item.productId) },
      status: "active", sellerId: { $in: sellerIds },
    }).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));
    const items = cart.items.map((item) => {
      const product = byId.get(String(item.productId));
      return product ? mapProduct(product, item.quantity) : null;
    }).filter(Boolean);
    return res.json({ success: true, items });
  } catch (error) {
    console.error("Get cart failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load your cart right now." });
  }
}

async function addCartItem(req, res) {
  try {
    const product = await getApprovedProduct(req.body?.productId);
    const quantity = Number(req.body?.quantity || 1);
    if (!product) return res.status(404).json({ success: false, message: "This product is no longer available." });
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be a whole number." });
    if (product.inventory < 1) return res.status(409).json({ success: false, message: "This product is out of stock." });

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id }, { $setOnInsert: { userId: req.user._id } },
      { upsert: true, new: true },
    );
    const existing = cart.items.find((item) => String(item.productId) === String(product._id));
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.inventory);
    else cart.items.push({ productId: product._id, quantity: Math.min(quantity, product.inventory) });
    await cart.save();
    return getCart(req, res);
  } catch (error) {
    console.error("Add cart item failed:", error);
    return res.status(500).json({ success: false, message: "Unable to update your cart right now." });
  }
}

async function updateCartItem(req, res) {
  try {
    const quantity = Number(req.body?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return removeCartItem(req, res);
    const product = await getApprovedProduct(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "This product is no longer available." });
    const cart = await Cart.findOne({ userId: req.user._id });
    const item = cart?.items.find((entry) => String(entry.productId) === String(product._id));
    if (!item) return res.status(404).json({ success: false, message: "Product is not in your cart." });
    item.quantity = Math.min(quantity, product.inventory);
    if (item.quantity < 1) cart.items = cart.items.filter((entry) => String(entry.productId) !== String(product._id));
    await cart.save();
    return getCart(req, res);
  } catch (error) {
    console.error("Update cart item failed:", error);
    return res.status(500).json({ success: false, message: "Unable to update your cart right now." });
  }
}

async function removeCartItem(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((item) => String(item.productId) !== String(req.params.productId));
      await cart.save();
    }
    return getCart(req, res);
  } catch (error) {
    console.error("Remove cart item failed:", error);
    return res.status(500).json({ success: false, message: "Unable to remove this item right now." });
  }
}

async function clearCart(req, res) {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [] } }, { upsert: true });
    return res.json({ success: true, items: [] });
  } catch (error) {
    console.error("Clear cart failed:", error);
    return res.status(500).json({ success: false, message: "Unable to clear your cart right now." });
  }
}

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem, clearCart };
