const User = require("../models/User");
const { AUTH_COOKIE, verifyAuthToken, clearAuthCookie } = require("../utils/auth");

// Session discovery is optional: visitors without a valid session should be
// represented as anonymous rather than receiving an expected 401 response.
async function optionalAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE];

  if (!token) {
    req.user = null;
    return next();
  }

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    clearAuthCookie(res);
    req.user = null;
    return next();
  }

  try {
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      clearAuthCookie(res);
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = optionalAuth;
