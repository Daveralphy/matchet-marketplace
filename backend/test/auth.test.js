const test = require("node:test");
const assert = require("node:assert/strict");
const { AUTH_COOKIE, signAuthToken, verifyAuthToken, setAuthCookie, clearAuthCookie } = require("../src/utils/auth");

test("auth token can be signed and verified for the same user", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-only-secret-for-unit-tests";
  try {
    const token = signAuthToken("507f1f77bcf86cd799439011");
    const payload = verifyAuthToken(token);
    assert.equal(payload.sub, "507f1f77bcf86cd799439011");
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test("production auth cookie uses secure, HTTP-only cross-site-compatible options", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    let captured;
    setAuthCookie({ cookie: (name, value, options) => { captured = { name, value, options }; } }, "test-token");
    assert.equal(captured.name, AUTH_COOKIE);
    assert.equal(captured.value, "test-token");
    assert.equal(captured.options.httpOnly, true);
    assert.equal(captured.options.secure, true);
    assert.equal(captured.options.sameSite, "none");
    assert.equal(captured.options.path, "/");
    assert.ok(captured.options.maxAge > 0);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
});

test("clearing auth cookie uses the same cookie options", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    let captured;
    clearAuthCookie({ clearCookie: (name, options) => { captured = { name, options }; } });
    assert.equal(captured.name, AUTH_COOKIE);
    assert.equal(captured.options.httpOnly, true);
    assert.equal(captured.options.secure, true);
    assert.equal(captured.options.sameSite, "none");
    assert.equal(captured.options.path, "/");
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
});
