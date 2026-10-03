const express = require("express");
const requireAuth = require("../middleware/auth");
const { getCart, addCartItem, updateCartItem, removeCartItem, clearCart } = require("../controllers/cart.controller");

const router = express.Router();
router.use(requireAuth);
router.get("/", getCart);
router.post("/items", addCartItem);
router.patch("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeCartItem);
router.delete("/", clearCart);
module.exports = router;
