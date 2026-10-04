const jwt = require("jsonwebtoken");

const AUTH_COOKIE = "matchet_auth";

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function signAuthToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function verifyAuthToken(token) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.verify(token, process.env.JWT_SECRET);
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
}

module.exports = { AUTH_COOKIE, signAuthToken, verifyAuthToken, setAuthCookie, clearAuthCookie };
