const crypto = require("crypto");
const PushSubscription = require("../models/PushSubscription");

function b64url(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized + "=".repeat((4 - normalized.length % 4) % 4), "base64");
}
function hmac(key, value) {
  return crypto.createHmac("sha256", key).update(value).digest();
}
function hkdfExpand(prk, info, length) {
  let output = Buffer.alloc(0);
  let previous = Buffer.alloc(0);
  for (let counter = 1; output.length < length; counter += 1) {
    previous = hmac(prk, Buffer.concat([previous, Buffer.from(info), Buffer.from([counter])]));
    output = Buffer.concat([output, previous]);
  }
  return output.subarray(0, length);
}
function vapidJwt(endpoint) {
  const publicKey = fromB64url(process.env.VAPID_PUBLIC_KEY);
  const privateKey = fromB64url(process.env.VAPID_PRIVATE_KEY);
  if (publicKey.length !== 65 || privateKey.length !== 32) throw new Error("VAPID keys must be the URL-safe base64 keys generated for Web Push.");
  const jwk = { kty: "EC", crv: "P-256", x: b64url(publicKey.subarray(1, 33)), y: b64url(publicKey.subarray(33, 65)), d: b64url(privateKey), ext: true };
  const key = crypto.createPrivateKey({ key: jwk, format: "jwk" });
  const audience = new URL(endpoint).origin;
  const header = b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const claims = b64url(JSON.stringify({ aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, sub: process.env.VAPID_SUBJECT || "mailto:support@matchet.com" }));
  const unsigned = header + "." + claims;
  const signature = crypto.sign("sha256", Buffer.from(unsigned), { key, dsaEncoding: "ieee-p1363" });
  return unsigned + "." + b64url(signature);
}
function encryptPayload(subscription, payload) {
  const userPublic = fromB64url(subscription.keys.p256dh);
  const authSecret = fromB64url(subscription.keys.auth);
  if (userPublic.length !== 65 || authSecret.length < 16) throw new Error("Invalid Web Push subscription keys.");
  const ecdh = crypto.createECDH("prime256v1");
  ecdh.generateKeys();
  const serverPublic = ecdh.getPublicKey();
  const sharedSecret = ecdh.computeSecret(userPublic);
  const prkKey = hmac(authSecret, sharedSecret);
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0"), userPublic, serverPublic]);
  const ikm = hkdfExpand(prkKey, keyInfo, 32);
  const salt = crypto.randomBytes(16);
  const prk = hmac(salt, ikm);
  const cek = hkdfExpand(prk, "Content-Encoding: aes128gcm\0", 16);
  const nonce = hkdfExpand(prk, "Content-Encoding: nonce\0", 12);
  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const plaintext = Buffer.concat([Buffer.from(JSON.stringify(payload)), Buffer.from([2])]);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);
  const header = Buffer.alloc(21);
  salt.copy(header, 0);
  header.writeUInt32BE(4096, 16);
  header[20] = serverPublic.length;
  return Buffer.concat([header, serverPublic, encrypted]);
}
async function sendPushToUser(userId, payload) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  const subscriptions = await PushSubscription.find({ userId }).lean();
  await Promise.all(subscriptions.map(async (record) => {
    try {
      const endpoint = record.subscription?.endpoint;
      if (!endpoint || !/^https:\/\//i.test(endpoint)) throw new Error("Invalid push endpoint.");
      const body = encryptPayload(record.subscription, payload);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `vapid t=${vapidJwt(endpoint)}, k=${process.env.VAPID_PUBLIC_KEY}`,
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          "TTL": "86400",
          "Urgency": "normal",
        },
        body,
      });
      if (response.status === 404 || response.status === 410) await PushSubscription.deleteOne({ _id: record._id });
      else if (!response.ok) throw new Error(`Push service returned ${response.status}`);
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) await PushSubscription.deleteOne({ _id: record._id });
      else throw error;
    }
  }));
}
module.exports = { sendPushToUser };
