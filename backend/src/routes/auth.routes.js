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
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/google", startGoogleSignIn);\nrouter.get("/google/callback", finishGoogleSignIn);\nrouter.get("/apple", appleSignIn);\nrouter.post("/forgot-password", requestPasswordReset);\nrouter.post("/reset-password", resetPassword);\nrouter.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateMe);
router.post("/change-password", requireAuth, changePassword);
router.delete("/account", requireAuth, deleteAccount);
router.post("/logout", logout);

module.exports = router;
