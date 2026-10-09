const express = require("express");
const requireAuth = require("../middleware/auth");
const {
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
  appleSignIn,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/google", startGoogleSignIn);
router.get("/google/callback", finishGoogleSignIn);
router.get("/apple", appleSignIn);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateMe);
router.post("/change-password", requireAuth, changePassword);
router.delete("/account", requireAuth, deleteAccount);
router.post("/logout", logout);

module.exports = router;
