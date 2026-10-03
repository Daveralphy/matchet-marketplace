const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ALLOWED_FOLDERS = new Set([
"matchet/products",
"matchet/services",
"matchet/profiles",
"matchet/stores",
"matchet/portfolio",
"matchet/verification",
]);

function assertConfigured() {
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the backend environment.");
}
}

function getFolder(folder) {
const safeFolder = String(folder || "").trim();
if (!ALLOWED_FOLDERS.has(safeFolder)) {
throw new Error("Invalid Cloudinary upload folder.");
}
return safeFolder;
}

async function uploadToCloudinary({ dataUrl, folder, resourceType = "auto", accessType = "upload" }) {
assertConfigured();

if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
throw new Error("A valid image data URI is required.");
}

const safeFolder = getFolder(folder);
const safeResourceType = ["image", "video", "raw", "auto"].includes(resourceType) ? resourceType : "auto";
const safeAccessType = ["upload", "private", "authenticated"].includes(accessType) ? accessType : "upload";

const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/${safeResourceType}/upload`;
const body = new FormData();
body.append("file", dataUrl);
body.append("folder", safeFolder);
body.append("type", safeAccessType);

const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");
const response = await fetch(endpoint, {
method: "POST",
headers: { Authorization: `Basic ${auth}` },
body,
});

const payload = await response.json().catch(() => ({}));
if (!response.ok) {
throw new Error(payload?.error?.message || "Cloudinary upload failed.");
}

return {
url: payload.secure_url || payload.url || "",
publicId: payload.public_id || "",
resourceType: payload.resource_type || safeResourceType,
type: payload.type || safeAccessType,
format: payload.format || "",
width: payload.width || null,
height: payload.height || null,
bytes: payload.bytes || null,
};
}

async function deleteFromCloudinary({ publicId, resourceType = "image", accessType = "upload" }) {
assertConfigured();

if (!publicId) return;

const safeResourceType = ["image", "video", "raw"].includes(resourceType)
? resourceType
: "image";

const safeAccessType = ["upload", "private", "authenticated"].includes(
accessType
)
? accessType
: "upload";

const timestamp = Math.floor(Date.now() / 1000);
const crypto = require("crypto");

const signatureBase =
`public_id=${publicId}&timestamp=${timestamp}&type=${safeAccessType}`;

const signature = crypto
.createHash("sha1")
.update(signatureBase + CLOUDINARY_API_SECRET)
.digest("hex");

const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUDINARY_CLOUD_NAME)}/${safeResourceType}/destroy`;

const body = new URLSearchParams({
public_id: publicId,
timestamp: String(timestamp),
api_key: CLOUDINARY_API_KEY,
signature,
type: safeAccessType,
});

const response = await fetch(endpoint, {
method: "POST",
headers: { "Content-Type": "application/x-www-form-urlencoded" },
body,
});

const payload = await response.json().catch(() => ({}));

if (!response.ok || payload.result === "error") {
throw new Error(payload?.error?.message || "Cloudinary deletion failed.");
}

return payload;
}

module.exports = {
uploadToCloudinary,
deleteFromCloudinary,
ALLOWED_FOLDERS,
};
