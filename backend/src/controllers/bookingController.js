const Booking=require("../models/Booking");
async function listBuyerBookings(req,res){
 try{
  const bookings=await Booking.find({buyerId:req.user._id}).sort({scheduledDate:1,createdAt:-1}).lean();
  return res.json({success:true,bookings});
 }catch(error){console.error("List buyer bookings failed:",error);return res.status(500).json({success:false,message:"Unable to load your bookings."});}
}
async function getBuyerBooking(req,res){
 try{
  const booking=await Booking.findOne({_id:req.params.id,buyerId:req.user._id}).lean();
  if(!booking)return res.status(404).json({success:false,message:"Booking not found."});
  return res.json({success:true,booking});
 }catch(error){return res.status(400).json({success:false,message:"Invalid booking."});}
}
module.exports={listBuyerBookings,getBuyerBooking};
