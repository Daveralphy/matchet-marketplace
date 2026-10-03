const express = require("express");
const requireAuth = require("../middleware/auth");
const { register, login, me, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateMe);
router.post("/logout", logout);

module.exports = router;
