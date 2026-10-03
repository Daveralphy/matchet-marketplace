const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const Notification = require("../models/Notification");
const StoreProfile = require("../models/StoreProfile");
const Product = require("../models/Product");
const Service = require("../models/Service");

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Administrator access is required." });
  }
  next();
}

async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      activeProviders,
      activeSellers,
      pendingProviders,
      pendingSellers,
      activeProducts,
      activeServices,
      providerApplications,
      sellerApplications,
    ] = await Promise.all([
      User.countDocuments({}),
      ProviderProfile.countDocuments({ status: "active", verificationStatus: "verified" }),
      StoreProfile.countDocuments({ status: "active", verificationStatus: "verified" }),
      ProviderProfile.countDocuments({ status: "draft", verificationStatus: "pending" }),
      StoreProfile.countDocuments({ status: "draft", verificationStatus: "pending" }),
      Product.countDocuments({ status: "active" }),
      Service.countDocuments({ status: "active" }),
      ProviderProfile.find({ verificationStatus: "pending", status: "draft" })
        .sort({ applicationSubmittedAt: 1, createdAt: 1 })
        .limit(5)
        .populate("userId", "firstName lastName email avatar")
        .lean(),
      StoreProfile.find({ verificationStatus: "pending", status: "draft" })
        .sort({ applicationSubmittedAt: 1, createdAt: 1 })
        .limit(5)
        .populate("userId", "firstName lastName email avatar")
        .lean(),
    ]);

    const providers = providerApplications.map((application) => ({
      id: application._id,
      type: "provider",
      submittedAt: application.applicationSubmittedAt || application.createdAt,
      name: [application.userId?.firstName, application.userId?.lastName].filter(Boolean).join(" ") || "Unnamed user",
      email: application.userId?.email || "",
      avatar: application.onboardingData?.profileImage?.url || application.onboardingData?.profileImage || application.userId?.avatar?.url || null,
      businessName: application.businessName || "Provider application",
      category: Array.isArray(application.categories) ? application.categories[0] || "Service provider" : "Service provider",
    }));

    const sellers = sellerApplications.map((application) => ({
      id: application._id,
      type: "seller",
      submittedAt: application.applicationSubmittedAt || application.createdAt,
      name: [application.userId?.firstName, application.userId?.lastName].filter(Boolean).join(" ") || "Unnamed user",
      email: application.userId?.email || "",
      avatar: application.logo?.url || application.userId?.avatar?.url || null,
      businessName: application.storeName || "Seller application",
      category: application.category || "Seller",
    }));

    return res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        stats: {
          totalUsers,
          activeProviders,
          activeSellers,
          pendingProviders,
          pendingSellers,
          activeListings: activeProducts + activeServices,
          activeProducts,
          activeServices,
        },
        pendingApplications: [...providers, ...sellers]
          .sort((a, b) => new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0))
          .slice(0, 8),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ success: false, message: "Unable to load the admin dashboard." });
  }
}

async function listProviderApplications(req, res) {
  try {
    const applications = await ProviderProfile.find({ verificationStatus: "pending", status: "draft" })
      .sort({ applicationSubmittedAt: 1, createdAt: 1 })
      .populate("userId", "firstName lastName email phone avatar capabilities role")
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
          role: application.userId?.role || "customer",
          capabilities: application.userId?.capabilities || {},
        },
        businessName: application.businessName,
        categories: application.categories,
        experience: application.experience,
        serviceArea: application.serviceArea,
        onboardingData: application.onboardingData || {},
        profileImage: application.onboardingData?.profileImage?.url || application.onboardingData?.profileImage || application.userId?.avatar?.url || null,
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
      $set: { "capabilities.provider": approved },
    });

    await Notification.create({
      userId: application.userId,
      type: approved ? "PROVIDER_APPLICATION_APPROVED" : "PROVIDER_APPLICATION_REJECTED",
      title: approved ? "Provider application approved" : "Provider application needs attention",
      message: approved
        ? "Your provider application has been approved. You can now access your provider dashboard and add your services."
        : (String(note).trim() || "Your provider application was not approved. Review the application status for the next steps."),
      relatedId: application._id,
      relatedType: "ProviderProfile",
    });

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

async function listSellerApplications(req, res) {
  try {
    const applications = await StoreProfile.find({ verificationStatus: "pending", status: "draft" })
      .sort({ applicationSubmittedAt: 1, createdAt: 1 })
      .populate("userId", "firstName lastName email phone avatar capabilities role")
      .lean();

    return res.json({
      success: true,
      data: applications.map((application) => ({
        id: application._id,
        status: application.status,
        verificationStatus: application.verificationStatus,
        submittedAt: application.applicationSubmittedAt || application.createdAt,
        store: {
          id: application.userId?._id,
          name: application.storeName,
          email: application.userId?.email || "",
          phone: application.contact?.phone || application.userId?.phone || "",
          avatar: application.logo?.url || application.userId?.avatar?.url || null,
          role: application.userId?.role || "customer",
          capabilities: application.userId?.capabilities || {},
        },
        category: application.category,
        description: application.description,
        onboardingData: application.onboardingData || {},
      })),
    });
  } catch (error) {
    console.error("Admin seller applications error:", error);
    return res.status(500).json({ success: false, message: "Unable to load seller applications." });
  }
}

async function reviewSellerApplication(req, res) {
  try {
    const { applicationId } = req.params;
    const { decision, note = "" } = req.body || {};

    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Decision must be approve or reject." });
    }

    const application = await StoreProfile.findById(applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Seller application not found." });

    const approved = decision === "approve";
    application.verificationStatus = approved ? "verified" : "rejected";
    application.status = approved ? "active" : "draft";
    application.reviewedAt = new Date();
    application.reviewNote = String(note).trim();
    await application.save();

    await User.findByIdAndUpdate(application.userId, {
      $set: { "capabilities.seller": approved },
    });

    await Notification.create({
      userId: application.userId,
      type: approved ? "SELLER_APPLICATION_APPROVED" : "SELLER_APPLICATION_REJECTED",
      title: approved ? "Seller application approved" : "Seller application needs attention",
      message: approved
        ? "Your seller application has been approved. You can now access your seller dashboard and add products."
        : (String(note).trim() || "Your seller application was not approved. Review your application for the next steps."),
      relatedId: application._id,
      relatedType: "StoreProfile",
    });

    return res.json({
      success: true,
      message: approved ? "Seller application approved." : "Seller application rejected.",
      data: {
        id: application._id,
        status: application.status,
        verificationStatus: application.verificationStatus,
        reviewedAt: application.reviewedAt,
        reviewNote: application.reviewNote,
      },
    });
  } catch (error) {
    console.error("Admin review seller application error:", error);
    return res.status(500).json({ success: false, message: "Unable to review seller application." });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find({})
      .select("firstName lastName username email role capabilities isActive phone avatar createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: users });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({ success: false, message: "Unable to load users." });
  }
}

async function listListings(req, res) {
  try {
    const [products, services] = await Promise.all([
      Product.find({}).populate("sellerId", "firstName lastName email").sort({ createdAt: -1 }).lean(),
      Service.find({}).populate("providerId", "firstName lastName email").sort({ createdAt: -1 }).lean(),
    ]);

    return res.json({
      success: true,
      data: {
        products: products.map((product) => ({
          id: product._id,
          type: "product",
          name: product.name,
          category: product.category,
          status: product.status,
          price: product.price,
          inventory: product.inventory,
          images: product.images || [],
          owner: product.sellerId ? {
            id: product.sellerId._id,
            name: [product.sellerId.firstName, product.sellerId.lastName].filter(Boolean).join(" "),
            email: product.sellerId.email,
          } : null,
          createdAt: product.createdAt,
        })),
        services: services.map((service) => ({
          id: service._id,
          type: "service",
          name: service.title,
          category: service.category,
          status: service.status,
          pricing: service.pricing,
          images: service.images || [],
          owner: service.providerId ? {
            id: service.providerId._id,
            name: [service.providerId.firstName, service.providerId.lastName].filter(Boolean).join(" "),
            email: service.providerId.email,
          } : null,
          createdAt: service.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Admin listings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load listings." });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { isActive } = req.body || {};
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean." });
    }

    if (String(userId) === String(req.user._id) && !isActive) {
      return res.status(400).json({ success: false, message: "You cannot deactivate your own admin account." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true, runValidators: true },
    ).select("firstName lastName username email role capabilities isActive");

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error("Admin user status error:", error);
    return res.status(500).json({ success: false, message: "Unable to update user status." });
  }
}

async function updateListingStatus(req, res) {
  try {
    const { type, listingId } = req.params;
    const { status } = req.body || {};

    const allowed = type === "product"
      ? ["draft", "active", "outOfStock", "archived"]
      : ["draft", "active", "paused", "archived"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid listing status." });
    }

    const Model = type === "product" ? Product : Service;
    const listing = await Model.findByIdAndUpdate(
      listingId,
      { $set: { status } },
      { new: true, runValidators: true },
    ).lean();

    if (!listing) return res.status(404).json({ success: false, message: "Listing not found." });

    return res.json({ success: true, data: listing });
  } catch (error) {
    console.error("Admin listing status error:", error);
    return res.status(500).json({ success: false, message: "Unable to update listing status." });
  }
}

module.exports = {
  requireAdmin,
  getAdminDashboard,
  listProviderApplications,
  reviewProviderApplication,
  listSellerApplications,
  reviewSellerApplication,
  listUsers,
  listListings,
  updateUserStatus,
  updateListingStatus,
};
