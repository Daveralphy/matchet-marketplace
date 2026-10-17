const crypto = require("crypto");
const ecdh = crypto.createECDH("prime256v1");
ecdh.generateKeys();
const encode = (value) => Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
console.log("VAPID_PUBLIC_KEY=" + encode(ecdh.getPublicKey()));
console.log("VAPID_PRIVATE_KEY=" + encode(ecdh.getPrivateKey()));
console.log("VAPID_SUBJECT=mailto:support@matchet.com");
