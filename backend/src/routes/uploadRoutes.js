const express = require("express");
const requireAuth = require("../middleware/auth");
const { uploadFiles } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", requireAuth, uploadFiles);

module.exports = router;
