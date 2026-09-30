const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const Service = require("../models/Service");
const StoreProfile = require("../models/StoreProfile");
const Product = require("../models/Product");

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Administrator access is required." });
  }
  next();
}

async function listProviderApplications(req, res) {
  try {
    const applications = await ProviderProfile.find({
      verificationStatus: "pending",
      status: "draft",
    })
      .sort({ applicationSubmittedAt: 1, createdAt: 1 })
      .populate("userId", "firstName lastName email phone avatar")
      .lean();

    return res.json({
      success: true,
      data: applications.map((application) => ({
        id: application._id,
        status: application.status,
        verificationStatus: application.verificationStatus,
        submittedAt: application.applicationSubmittedAt || application.createdAt,
        provider: {
          id: application.userId?._id,
          name: [application.userId?.firstName, application.userId?.lastName].filter(Boolean).join(" "),
          email: application.userId?.email || "",
          phone: application.userId?.phone || "",
          avatar: application.userId?.avatar?.url || null,
        },
        businessName: application.businessName,
        categories: application.categories,
        experience: application.experience,
        serviceArea: application.serviceArea,
        onboardingData: application.onboardingData || {},
      })),
    });
  } catch (error) {
    console.error("Admin provider applications error:", error);
    return res.status(500).json({ success: false, message: "Unable to load provider applications." });
  }
}

async function reviewProviderApplication(req, res) {
  try {
    const { applicationId } = req.params;
    const { decision, note = "" } = req.body || {};

    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Decision must be approve or reject." });
    }

    const application = await ProviderProfile.findById(applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Provider application not found." });

    const approved = decision === "approve";
    application.verificationStatus = approved ? "verified" : "rejected";
    application.status = approved ? "active" : "draft";
    application.reviewedAt = new Date();
    application.reviewNote = String(note).trim();
    await application.save();

    await User.findByIdAndUpdate(application.userId, {
      $set: { role: "provider" },
    });

    if (approved) {
      await Service.updateMany(
        { providerId: application.userId, status: "draft" },
        { $set: { status: "active" } },
      );
    }

    return res.json({
      success: true,
      message: approved ? "Provider application approved." : "Provider application rejected.",
      data: {
        id: application._id,
        status: application.status,
        verificationStatus: application.verificationStatus,
        reviewedAt: application.reviewedAt,
        reviewNote: application.reviewNote,
      },
    });
  } catch (error) {
    console.error("Admin review provider application error:", error);
    return res.status(500).json({ success: false, message: "Unable to review this provider application." });
  }
}

module.exports = { requireAdmin, listProviderApplications, reviewProviderApplication, listSellerApplications, reviewSellerApplication };

async function listSellerApplications(req,res){try{const applications=await StoreProfile.find({verificationStatus:"pending",status:"draft"}).sort({applicationSubmittedAt:1,createdAt:1}).populate("userId","firstName lastName email phone avatar").lean();return res.json({success:true,data:applications.map(a=>({id:a._id,status:a.status,verificationStatus:a.verificationStatus,submittedAt:a.applicationSubmittedAt||a.createdAt,store:{name:a.storeName,email:a.userId?.email||"",phone:a.contact?.phone||a.userId?.phone||"",avatar:a.logo?.url||a.userId?.avatar?.url||null},category:a.category,description:a.description,onboardingData:a.onboardingData||{}}))})}catch(error){console.error("Admin seller applications error:",error);return res.status(500).json({success:false,message:"Unable to load seller applications."})}}
async function reviewSellerApplication(req,res){try{const {applicationId}=req.params;const {decision,note=""}=req.body||{};if(!["approve","reject"].includes(decision))return res.status(400).json({success:false,message:"Decision must be approve or reject."});const application=await StoreProfile.findById(applicationId);if(!application)return res.status(404).json({success:false,message:"Seller application not found."});const approved=decision==="approve";application.verificationStatus=approved?"verified":"rejected";application.status=approved?"active":"draft";application.reviewedAt=new Date();application.reviewNote=String(note).trim();await application.save();await User.findByIdAndUpdate(application.userId,{$set:{role:"provider"}});if(approved)await Product.updateMany({sellerId:application.userId,status:"draft"},{$set:{status:"active"}});return res.json({success:true,message:approved?"Seller application approved.":"Seller application rejected.",data:{id:application._id,status:application.status,verificationStatus:application.verificationStatus,reviewedAt:application.reviewedAt,reviewNote:application.reviewNote}})}catch(error){console.error("Admin review seller application error:",error);return res.status(500).json({success:false,message:"Unable to review this seller application."})}}
