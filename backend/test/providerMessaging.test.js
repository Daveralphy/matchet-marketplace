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
