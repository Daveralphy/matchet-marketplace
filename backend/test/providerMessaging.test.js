const test = require("node:test");
const assert = require("node:assert/strict");
const { canonicalConversationId } = require("../src/controllers/provider-message.controller");

test("conversation identifiers are stable regardless of participant order", () => {
  assert.equal(
    canonicalConversationId("66a000000000000000000002", "66a000000000000000000001"),
    canonicalConversationId("66a000000000000000000001", "66a000000000000000000002"),
  );
});

test("conversation identifiers contain exactly the two sorted participant ids", () => {
  assert.equal(
    canonicalConversationId("b-user", "a-user"),
    "a-user:b-user",
  );
});


test("conversation access requires the requesting provider to be one of exactly two participants", () => {
  const { getConversationCustomerId } = require("../src/controllers/provider-message.controller");
  const providerId = "66a000000000000000000001";
  const customerId = "66a000000000000000000002";
  const otherId = "66a000000000000000000003";

  assert.equal(getConversationCustomerId(canonicalConversationId(providerId, customerId), providerId), customerId);
  assert.equal(getConversationCustomerId(canonicalConversationId(customerId, otherId), providerId), null);
  assert.equal(getConversationCustomerId([providerId, customerId, otherId].sort().join(":"), providerId), null);
  assert.equal(getConversationCustomerId("not-an-object-id:also-invalid", providerId), null);
  assert.equal(getConversationCustomerId(canonicalConversationId(providerId, providerId), providerId), null);
});

test("conversation access rejects a non-canonical participant order", () => {
  const { getConversationCustomerId } = require("../src/controllers/provider-message.controller");
  const providerId = "66a000000000000000000002";
  const customerId = "66a000000000000000000001";

  assert.equal(getConversationCustomerId(providerId + ":" + customerId, providerId), null);
});
