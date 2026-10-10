const ProviderProfile = require("../models/ProviderProfile");
const StoreProfile = require("../models/StoreProfile");

async function requireActiveProvider(req, res, next) {
  const profile = await ProviderProfile.findOne({ userId: req.user._id });

  if (!profile) {
    return res.status(403).json({
      success: false,
      message: "Complete your provider profile before managing services.",
      code: "PROVIDER_PROFILE_REQUIRED",
    });
  }

  if (profile.status !== "active" || profile.verificationStatus !== "verified") {
    return res.status(403).json({
      success: false,
      message: "Your provider profile must be approved before you can manage services.",
      code: "PROVIDER_NOT_ACTIVE",
      profileStatus: profile.status,
      verificationStatus: profile.verificationStatus,
    });
  }

  req.providerProfile = profile;
  next();
}

async function requireActiveSeller(req, res, next) {
  if (!req.user?.capabilities?.seller) {
    return res.status(403).json({ success: false, message: "Seller access is not enabled for this account.", code: "SELLER_CAPABILITY_REQUIRED" });
  }
  const profile = await StoreProfile.findOne({ userId: req.user._id });

  if (!profile) {
    return res.status(403).json({
      success: false,
      message: "Complete your seller profile before managing products.",
      code: "SELLER_PROFILE_REQUIRED",
    });
  }

  if (profile.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your seller profile must be approved before you can manage products.",
      code: "SELLER_NOT_ACTIVE",
      profileStatus: profile.status,
    });
  }

  req.storeProfile = profile;
  next();
}


async function requireActiveSellerOrProvider(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Please sign in to access messages." });

    if (req.user?.capabilities?.seller) {
      const store = await StoreProfile.findOne({ userId });
      if (store?.status === "active" && store?.verificationStatus === "verified") {
        req.storeProfile = store;
        req.messagingProfileType = "seller";
        return next();
      }
    }

    const provider = await ProviderProfile.findOne({ userId });
    if (provider?.status === "active" && provider?.verificationStatus === "verified") {
      req.providerProfile = provider;
      req.messagingProfileType = "provider";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Messaging is available to approved sellers and service providers.",
      code: "MESSAGING_PROFILE_REQUIRED",
    });
  } catch (error) {
    console.error("Messaging access check failed:", error);
    return res.status(500).json({ success: false, message: "Unable to verify messaging access right now." });
  }
}

module.exports = { requireActiveProvider, requireActiveSeller, requireActiveSellerOrProvider };
