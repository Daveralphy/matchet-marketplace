const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { clearAuthCookie, setAuthCookie, signAuthToken } = require("../utils/auth");

const normalize = (value) => String(value || "").trim();

function serializeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    avatar: user.avatar || null,
    location: user.location || null,
    preferences: user.preferences || {},
    role: user.role,
    capabilities: {
      seller: Boolean(user.capabilities?.seller),
      provider: Boolean(user.capabilities?.provider || user.role === "provider"),
    },
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

async function uniqueUsername(firstName, lastName) {
  const base = (firstName + lastName).toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 24) || "matchetuser";
  let username = base;
  let suffix = 1;

  while (await User.exists({ username })) {
    const suffixText = String(suffix++);
    username = base.slice(0, 24 - suffixText.length) + suffixText;
  }

  return username;
}

function validateRegistration(body) {
  const firstName = normalize(body.firstName);
  const lastName = normalize(body.lastName);
  const email = normalize(body.email).toLowerCase();
  const phone = normalize(body.phone);
  const password = String(body.password || "");
  const errors = {};

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Phone number is required.";
  if (password.length < 8) errors.password = "Password must be at least 8 characters.";

  return { errors, values: { firstName, lastName, email, phone, password } };
}

async function register(req, res) {
  try {
    const { errors, values } = validateRegistration(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, message: "Please correct the highlighted fields.", errors });

    if (await User.exists({ email: values.email })) {
      return res.status(409).json({ success: false, message: "An account with this email already exists.", errors: { email: "This email is already registered." } });
    }

    const username = await uniqueUsername(values.firstName, values.lastName);
    const passwordHash = await bcrypt.hash(values.password, 12);
    const user = await User.create({ ...values, username, passwordHash, role: "customer" });

    setAuthCookie(res, signAuthToken(user._id));
    return res.status(201).json({ success: true, message: "Account created successfully.", user: serializeUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "An account with one of those details already exists." });
    console.error("Registration failed:", error);
    return res.status(500).json({ success: false, message: "Unable to create your account right now." });
  }
}

async function login(req, res) {
  try {
    const identifier = normalize(req.body.identifier).toLowerCase();
    const password = String(req.body.password || "");

    if (!identifier || !password) return res.status(400).json({ success: false, message: "Email or username and password are required." });

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select("+passwordHash");
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Invalid email, username, or password." });

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid email, username, or password." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    setAuthCookie(res, signAuthToken(user._id));
    return res.status(200).json({ success: true, message: "Logged in successfully.", user: serializeUser(user) });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ success: false, message: "Unable to log you in right now." });
  }
}

async function updateMe(req, res) {
  try {
    const user = req.user;
    const body = req.body || {};
    if (body.firstName !== undefined) user.firstName = normalize(body.firstName);
    if (body.lastName !== undefined) user.lastName = normalize(body.lastName);
    if (body.phone !== undefined) user.phone = normalize(body.phone);
    if (body.avatar !== undefined) user.avatar = body.avatar || null;
    if (body.location !== undefined) user.location = { ...(user.location?.toObject?.() || user.location || {}), ...(body.location || {}) };
    if (body.preferences !== undefined) user.preferences = { ...(user.preferences || {}), ...(body.preferences || {}) };
    await user.save();
    return res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    console.error("Profile update failed:", error);
    return res.status(500).json({ success: false, message: "Unable to update your profile right now." });
  }
}

async function me(req, res) {
  return res.status(200).json({ success: true, user: serializeUser(req.user) });
}

function logout(_req, res) {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}

module.exports = { register, login, me, updateMe, logout };
