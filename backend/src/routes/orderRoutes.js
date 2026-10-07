const express=require("express");
const requireAuth=require("../middleware/auth");
const {listBuyerOrders,getBuyerOrder,createBuyerOrder}=require("../controllers/orderController");
const router=express.Router();
router.use(requireAuth);
router.get("/",listBuyerOrders);
router.post("/",createBuyerOrder);
router.get("/:id",getBuyerOrder);
module.exports=router;
