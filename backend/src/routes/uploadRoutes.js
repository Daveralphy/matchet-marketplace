const express = require("express");
const requireAuth = require("../middleware/auth");
const { uploadFiles, deleteFile } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", requireAuth, uploadFiles);
router.delete("/", requireAuth, deleteFile);

module.exports = router;
