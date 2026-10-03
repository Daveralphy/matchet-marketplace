const userService = require("../services/userService");

async function getProfile(req, res) {
  try {
    const user = await userService.getProfile(req.user._id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to load profile.",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That username or email is already in use.",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to update profile.",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
