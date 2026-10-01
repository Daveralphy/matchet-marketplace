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

module.exports = { requireActiveProvider, requireActiveSeller };
