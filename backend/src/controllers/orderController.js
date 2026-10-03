const Order = require("../models/Order");

async function listBuyerOrders(req,res){
  try {
    const orders=await Order.find({buyerId:req.user._id}).sort({createdAt:-1}).lean();
    return res.json({success:true,orders});
  } catch(error){ console.error("List buyer orders failed:",error); return res.status(500).json({success:false,message:"Unable to load your orders."}); }
}
async function getBuyerOrder(req,res){
  try {
    const order=await Order.findOne({_id:req.params.id,buyerId:req.user._id}).lean();
    if(!order)return res.status(404).json({success:false,message:"Order not found."});
    return res.json({success:true,order});
  } catch(error){return res.status(400).json({success:false,message:"Invalid order."});}
}
module.exports={listBuyerOrders,getBuyerOrder};
