const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FOLDER_RULES = {
  "matchet/products": { maxFiles: 6, maxBytes: 5 * 1024 * 1024, accessType: "upload" },
  "matchet/services": { maxFiles: 6, maxBytes: 5 * 1024 * 1024, accessType: "upload" },
  "matchet/profiles": { maxFiles: 1, maxBytes: 5 * 1024 * 1024, accessType: "upload" },
  "matchet/stores": { maxFiles: 2, maxBytes: 5 * 1024 * 1024, accessType: "upload" },
  "matchet/portfolio": { maxFiles: 10, maxBytes: 10 * 1024 * 1024, accessType: "upload" },
  "matchet/verification": { maxFiles: 3, maxBytes: 5 * 1024 * 1024, accessType: "upload" },
};

function decodeDataUrl(dataUrl) {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ""));
  if (!match) throw new Error("Invalid file data.");

  const buffer = Buffer.from(match[2], "base64");
  return { mimeType: match[1].toLowerCase(), bytes: buffer.length };
}

function allowedMime(mimeType, folder) {
  if (folder === "matchet/portfolio") {
    return ["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(mimeType);
  }
  if (folder === "matchet/verification") {
    return ["image/jpeg", "image/png", "application/pdf"].includes(mimeType);
  }
  return ["image/jpeg", "image/png", "image/webp"].includes(mimeType);
}

async function uploadFiles(req, res) {
  try {
    const files = Array.isArray(req.body?.files) ? req.body.files : [req.body?.file].filter(Boolean);
    if (!files.length) return res.status(400).json({ success: false, message: "No files were provided." });

    const folder = String(files[0]?.folder || "");
    const rule = FOLDER_RULES[folder];
    if (!rule) return res.status(400).json({ success: false, message: "Invalid upload folder." });
    if (files.length > rule.maxFiles) return res.status(400).json({ success: false, message: `You can upload up to ${rule.maxFiles} file(s) here.` });

    const uploaded = [];
    for (const file of files) {
      if (String(file?.folder || "") !== folder) {
        return res.status(400).json({ success: false, message: "All files in one upload request must use the same folder." });
      }

      const { mimeType, bytes } = decodeDataUrl(file.dataUrl);
      if (bytes > rule.maxBytes || bytes > MAX_FILE_SIZE) {
        return res.status(400).json({ success: false, message: `File exceeds the ${Math.round(rule.maxBytes / (1024 * 1024))}MB limit.` });
      }
      if (!allowedMime(mimeType, folder)) {
        return res.status(400).json({ success: false, message: "This file type is not supported." });
      }

      const resourceType = mimeType === "video/mp4" ? "video" : mimeType === "application/pdf" ? "raw" : "image";
      const result = await uploadToCloudinary({
        dataUrl: file.dataUrl,
        folder,
        resourceType,
        accessType: rule.accessType,
      });

      uploaded.push({
        ...result,
        name: String(file.name || ""),
        mimeType,
      });
    }

    return res.status(201).json({ success: true, files: uploaded });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Unable to upload your file right now." : error.message,
    });
  }
}

async function deleteFile(req, res) {
  try {
    const { publicId, resourceType = "image", accessType = "upload" } = req.body || {};
    if (!publicId) return res.status(400).json({ success: false, message: "Cloudinary public ID is required." });

    await deleteFromCloudinary({ publicId, resourceType, accessType });
    return res.json({ success: true, message: "File deleted." });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Unable to delete this file right now." : error.message,
    });
  }
}

module.exports = { uploadFiles, deleteFile };
