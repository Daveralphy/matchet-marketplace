const User = require("../models/User");
const { AUTH_COOKIE, verifyAuthToken } = require("../utils/auth");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) return res.status(401).json({ success: false, message: "Authentication required." });

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Your session is no longer valid." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }
}

module.exports = requireAuth;
