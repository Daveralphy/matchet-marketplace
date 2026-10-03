const express=require("express");
const {requireAuth}=require("../middleware/auth");
const {listBuyerOrders,getBuyerOrder}=require("../controllers/orderController");
const router=express.Router();
router.use(requireAuth);
router.get("/",listBuyerOrders);
router.get("/:id",getBuyerOrder);
module.exports=router;
