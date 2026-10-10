const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { clearAuthCookie, setAuthCookie, signAuthToken } = require("../utils/auth");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const Payout = require("../models/Payout");
const Product = require("../models/Product");
const Service = require("../models/Service");

const CLIENT_URL = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const GOOGLE_SCOPES = "openid email profile";

function googleRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI || `${(process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/api/auth/google/callback`;
}

function googleIsConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

async function sendPasswordResetEmail(email, resetUrl) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Password reset email is not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Reset your Matchet password",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#10183f;max-width:560px;margin:auto"><h1>Reset your Matchet password</h1><p>We received a request to reset your password. Use the button below to choose a new one. This link expires in 30 minutes.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#07983f;color:#fff;text-decoration:none;border-radius:8px">Reset password</a></p><p>If you did not request this, you can ignore this email.</p></div>`,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Password reset email delivery failed (${response.status}): ${details.slice(0, 300)}`);
  }
}

async function exchangeGoogleSignIn(req, res) {
  const code = String(req.body?.code || "");
  if (!code) return res.status(400).json({ success: false, message: "The Google sign-in code is missing." });

  try {
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const user = await User.findOneAndUpdate(
      {
        googleLoginCodeHash: codeHash,
        googleLoginCodeExpiresAt: { $gt: new Date() },
        isActive: true,
      },
      {
        $set: { lastLoginAt: new Date() },
        $unset: { googleLoginCodeHash: "", googleLoginCodeExpiresAt: "" },
      },
      { new: true },
    );
    if (!user) return res.status(400).json({ success: false, message: "This Google sign-in session is invalid or expired. Please try again." });
    setAuthCookie(res, signAuthToken(user._id));
    return res.status(200).json({ success: true, user: serializeUser(user) });
  } catch (error) {
    console.error("Google sign-in exchange failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to finish Google sign-in right now." });
  }
}

function appleSignIn(req, res) {
  const appleConfigured = Boolean(
    process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY &&
    process.env.APPLE_REDIRECT_URI
  );
  if (!appleConfigured) {
    return res.status(200).json({
      success: false,
      code: "APPLE_NOT_CONFIGURED",
      message: "Apple sign-in is not available yet. Please continue with Google or your email and password.",
    });
  }
  return res.status(200).json({
    success: false,
    code: "APPLE_SIGN_IN_PENDING",
    message: "Apple sign-in credentials are configured, but the Apple authentication flow still needs to be enabled. Please use another sign-in method for now.",
  });
}

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
    passwordSet: user.passwordSet !== false,
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

async function requestPasswordReset(req, res) {
  const email = normalize(req.body?.email).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address.", errors: { email: "Enter a valid email address." } });
  }

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return res.status(503).json({ success: false, message: "Password reset email is not configured yet. Please contact support or try again later." });
  }

  try {
    const user = await User.findOne({ email, isActive: true });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();
      const resetUrl = `${CLIENT_URL()}/reset-password?token=${encodeURIComponent(rawToken)}`;
      try {
        await sendPasswordResetEmail(user.email, resetUrl);
      } catch (emailError) {
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpiresAt = undefined;
        await user.save();
        throw emailError;
      }
    }

    return res.status(200).json({ success: true, message: "If an active account exists for that email, a password reset link has been sent. Please check your inbox." });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    return res.status(502).json({ success: false, message: "We could not send the reset email right now. Please try again later." });
  }
}

async function resetPassword(req, res) {
  const token = String(req.body?.token || "");
  const password = String(req.body?.password || "");
  if (!token || !password) return res.status(400).json({ success: false, message: "The reset link and new password are required." });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { $gt: new Date() },
        isActive: true,
      },
      {
        $set: { passwordHash, passwordSet: true },
        $unset: { passwordResetTokenHash: "", passwordResetExpiresAt: "" },
      },
      { new: true },
    );

    if (!user) return res.status(400).json({ success: false, message: "This password reset link is invalid or has expired. Request a new one to continue." });
    return res.status(200).json({ success: true, message: "Your password has been reset. You can now log in with your new password." });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({ success: false, message: "Unable to reset your password right now. Please try again." });
  }
}

function startGoogleSignIn(req, res) {
  if (!googleIsConfigured()) {
    return res.redirect(`${CLIENT_URL()}/login?authError=google_not_configured`);
  }

  const state = crypto.randomBytes(24).toString("hex");
  res.cookie("matchet_google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/api/auth",
  });
  const query = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: GOOGLE_SCOPES,
    state,
    prompt: "select_account",
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`);
}

async function finishGoogleSignIn(req, res) {
  const fail = (reason) => res.redirect(`${CLIENT_URL()}/login?authError=${encodeURIComponent(reason)}`);
  const expectedState = req.cookies?.matchet_google_oauth_state;
  res.clearCookie("matchet_google_oauth_state", { path: "/api/auth", sameSite: "lax", secure: process.env.NODE_ENV === "production" });

  if (!googleIsConfigured()) return fail("google_not_configured");
  if (req.query.error) return fail("google_cancelled");
  if (!req.query.code || !req.query.state || !expectedState || req.query.state !== expectedState) return fail("google_state_invalid");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(req.query.code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: googleRedirectUri(),
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token) {
      console.error("Google token exchange failed:", tokens.error || tokenResponse.status);
      return fail("google_exchange_failed");
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email || profile.verified_email !== true) return fail("google_email_unverified");

    const email = normalize(profile.email).toLowerCase();
    let user = await User.findOne({ email }).select("+passwordHash");
    if (user && !user.isActive) return fail("account_inactive");

    if (!user) {
      const fullName = normalize(profile.name);
      const firstName = normalize(profile.given_name) || fullName.split(/\s+/)[0] || "Matchet";
      const lastName = normalize(profile.family_name) || fullName.split(/\s+/).slice(1).join(" ") || "User";
      const username = await uniqueUsername(firstName, lastName);
      const generatedPassword = crypto.randomBytes(48).toString("hex");
      const passwordHash = await bcrypt.hash(generatedPassword, 12);
      user = await User.create({
        firstName,
        lastName,
        username,
        email,
        passwordHash,
        passwordSet: false,
        avatar: profile.picture ? { url: profile.picture } : undefined,
        role: "customer",
      });
    }

    const rawLoginCode = crypto.randomBytes(32).toString("hex");
    user.googleLoginCodeHash = crypto.createHash("sha256").update(rawLoginCode).digest("hex");
    user.googleLoginCodeExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();
    return res.redirect(`${CLIENT_URL()}/auth/callback?code=${encodeURIComponent(rawLoginCode)}`);
  } catch (error) {
    console.error("Google sign-in failed:", error.message);
    return fail("google_sign_in_failed");
  }
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

    if (body.email !== undefined) {
      const email = normalize(body.email).toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
          errors: { email: "Enter a valid email address." },
        });
      }

      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
          errors: { email: "This email is already registered." },
        });
      }

      user.email = email;
    }

    if (body.firstName !== undefined) user.firstName = normalize(body.firstName);
    if (body.lastName !== undefined) user.lastName = normalize(body.lastName);
    if (body.phone !== undefined) user.phone = normalize(body.phone);
    if (body.avatar !== undefined) user.avatar = body.avatar || null;
    if (body.location !== undefined) user.location = { ...(user.location?.toObject?.() || user.location || {}), ...(body.location || {}) };
    if (body.preferences !== undefined) user.preferences = { ...(user.preferences || {}), ...(body.preferences || {}) };

    await user.save();
    return res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        errors: { email: "This email is already registered." },
      });
    }

    console.error("Profile update failed:", error);
    return res.status(500).json({ success: false, message: "Unable to update your profile right now." });
  }
}

async function changePassword(req, res) {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your session is no longer valid.",
      });
    }

    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!currentPasswordMatches) {
      return res.status(401).json({
        success: false,
        message: "Your current password is incorrect.",
      });
    }

    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      return res.status(400).json({
        success: false,
        message: "Your new password must differ from your current password.",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Password change failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to change your password right now.",
    });
  }
}

async function deleteAccount(req, res) {
  try {
    const currentPassword = String(req.body?.currentPassword || "");

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Your current password is required to close your account.",
      });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your session is no longer valid.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Administrator accounts cannot be closed through this page. Please contact the system administrator.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Your current password is incorrect.",
      });
    }

    const userId = user._id;

    const activeOrder = await Order.exists({
      $or: [
        { buyerId: userId },
        { "items.sellerId": userId },
      ],
      orderStatus: {
        $in: ["pending", "confirmed", "processing", "shipped"],
      },
    });

    if (activeOrder) {
      return res.status(409).json({
        success: false,
        message:
          "Your account cannot be closed while you have unresolved orders. Please resolve them first.",
      });
    }

    const activeBooking = await Booking.exists({
      $or: [{ buyerId: userId }, { providerId: userId }],
      status: { $in: ["pending", "confirmed", "inProgress"] },
    });

    if (activeBooking) {
      return res.status(409).json({
        success: false,
        message:
          "Your account cannot be closed while you have active bookings. Please resolve them first.",
      });
    }

    const activePayout = await Payout.exists({
      providerId: userId,
      status: { $in: ["pending", "processing"] },
    });

    if (activePayout) {
      return res.status(409).json({
        success: false,
        message:
          "Your account cannot be closed while you have pending payouts. Please wait until they are resolved.",
      });
    }

    const activeProduct = await Product.exists({
      sellerId: userId,
      status: "active",
    });

    if (activeProduct) {
      return res.status(409).json({
        success: false,
        message:
          "Your account cannot be closed while you have active product listings. Please archive them first.",
      });
    }

    const activeService = await Service.exists({
      providerId: userId,
      status: "active",
    });

    if (activeService) {
      return res.status(409).json({
        success: false,
        message:
          "Your account cannot be closed while you have active service listings. Please archive them first.",
      });
    }

    user.isActive = false;
    await user.save();

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Your account has been closed successfully.",
    });
  } catch (error) {
    console.error("Account closure failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to close your account right now.",
    });
  }
}
async function me(req, res) {
  return res.status(200).json({ success: true, user: serializeUser(req.user) });
}

function logout(_req, res) {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}

module.exports = {
  register,
  login,
  me,
  updateMe,
  logout,
  changePassword,
  deleteAccount,
  requestPasswordReset,
  resetPassword,
  startGoogleSignIn,
  finishGoogleSignIn,
  exchangeGoogleSignIn,
  appleSignIn,
};