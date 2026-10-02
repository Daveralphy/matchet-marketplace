const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");
const StoreProfile = require("../models/StoreProfile");
const Product = require("../models/Product");
const Service = require("../models/Service");

async function listAdminUsers(req, res) {
  try {
    const users = await User.find({})
      .select("firstName lastName username email role capabilities phone avatar isActive createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .lean();

    const [providerProfiles, sellerProfiles] = await Promise.all([
      ProviderProfile.find({ userId: { $in: users.map((u) => u._id) } })
        .select("userId businessName status verificationStatus")
        .lean(),
      StoreProfile.find({ userId: { $in: users.map((u) => u._id) } })
        .select("userId storeName status verificationStatus")
        .lean(),
    ]);

    const providers = new Map(providerProfiles.map((p) => [String(p.userId), p]));
    const sellers = new Map(sellerProfiles.map((s) => [String(s.userId), s]));

    return res.json({
      success: true,
      data: users.map((user) => {
        const provider = providers.get(String(user._id));
        const seller = sellers.get(String(user._id));
        return {
          id: user._id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          username: user.username,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar?.url || null,
          role: user.role,
          capabilities: user.capabilities || { provider: false, seller: false },
          isActive: user.isActive !== false,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt || null,
          provider: provider ? {
            businessName: provider.businessName,
            status: provider.status,
            verificationStatus: provider.verificationStatus,
          } : null,
          seller: seller ? {
            storeName: seller.storeName,
            status: seller.status,
            verificationStatus: seller.verificationStatus,
          } : null,
        };
      }),
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({ success: false, message: "Unable to load users." });
  }
}

async function listAdminListings(req, res) {
  try {
    const [products, services] = await Promise.all([
      Product.find({}).select("sellerId name category price inventory status images createdAt updatedAt").sort({ createdAt: -1 }).limit(100).populate("sellerId", "firstName lastName email").lean(),
      Service.find({}).select("providerId title category pricing status images createdAt updatedAt").sort({ createdAt: -1 }).limit(100).populate("providerId", "firstName lastName email").lean(),
    ]);

    const data = [
      ...products.map((item) => ({
        id: item._id,
        type: "product",
        title: item.name,
        category: item.category,
        status: item.status,
        price: item.price,
        inventory: item.inventory,
        image: item.images?.find((image) => image.isPrimary)?.url || item.images?.[0]?.url || null,
        owner: [item.sellerId?.firstName, item.sellerId?.lastName].filter(Boolean).join(" ") || item.sellerId?.email || "Unknown",
        createdAt: item.createdAt,
      })),
      ...services.map((item) => ({
        id: item._id,
        type: "service",
        title: item.title,
        category: item.category,
        status: item.status,
        price: item.pricing?.amount ?? null,
        currency: item.pricing?.currency || "NGN",
        pricingType: item.pricing?.type || null,
        image: item.images?.find((image) => image.isPrimary)?.url || item.images?.[0]?.url || null,
        owner: [item.providerId?.firstName, item.providerId?.lastName].filter(Boolean).join(" ") || item.providerId?.email || "Unknown",
        createdAt: item.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Admin listings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load listings." });
  }
}

async function getAdminReports(req, res) {
  try {
    const [
      totalUsers, activeUsers, adminUsers, providerUsers, sellerUsers,
      pendingProviders, verifiedProviders, rejectedProviders,
      pendingSellers, verifiedSellers, rejectedSellers,
      draftProducts, activeProducts, archivedProducts,
      draftServices, activeServices, archivedServices,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ "capabilities.provider": true }),
      User.countDocuments({ "capabilities.seller": true }),
      ProviderProfile.countDocuments({ verificationStatus: "pending", status: "draft" }),
      ProviderProfile.countDocuments({ verificationStatus: "verified", status: "active" }),
      ProviderProfile.countDocuments({ verificationStatus: "rejected" }),
      StoreProfile.countDocuments({ verificationStatus: "pending", status: "draft" }),
      StoreProfile.countDocuments({ verificationStatus: "verified", status: "active" }),
      StoreProfile.countDocuments({ verificationStatus: "rejected" }),
      Product.countDocuments({ status: "draft" }),
      Product.countDocuments({ status: "active" }),
      Product.countDocuments({ status: "archived" }),
      Service.countDocuments({ status: "draft" }),
      Service.countDocuments({ status: "active" }),
      Service.countDocuments({ status: "archived" }),
    ]);

    return res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        users: { total: totalUsers, active: activeUsers, admins: adminUsers, providers: providerUsers, sellers: sellerUsers },
        providers: { pending: pendingProviders, verified: verifiedProviders, rejected: rejectedProviders },
        sellers: { pending: pendingSellers, verified: verifiedSellers, rejected: rejectedSellers },
        products: { draft: draftProducts, active: activeProducts, archived: archivedProducts },
        services: { draft: draftServices, active: activeServices, archived: archivedServices },
      },
    });
  } catch (error) {
    console.error("Admin reports error:", error);
    return res.status(500).json({ success: false, message: "Unable to load reports." });
  }
}

async function getAdminSettings(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("firstName lastName username email role capabilities phone avatar isActive createdAt lastLoginAt")
      .lean();

    return res.json({
      success: true,
      data: {
        account: user ? {
          id: user._id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          username: user.username,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar?.url || null,
          role: user.role,
          capabilities: user.capabilities || {},
          isActive: user.isActive !== false,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt || null,
        } : null,
        platform: {
          environment: process.env.NODE_ENV || "development",
          apiBase: "/api",
        },
      },
    });
  } catch (error) {
    console.error("Admin settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load admin settings." });
  }
}

module.exports = {
  listAdminUsers,
  listAdminListings,
  getAdminReports,
  getAdminSettings,
};
