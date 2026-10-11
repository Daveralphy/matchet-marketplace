const test = require("node:test");
const assert = require("node:assert/strict");
const { canonicalConversationId, getOtherParticipantId } = require("../src/controllers/message.controller");

const userA = "64b000000000000000000001";
const userB = "64b000000000000000000002";
const userC = "64b000000000000000000003";

test("canonicalConversationId is stable regardless of participant order", () => {
  assert.equal(canonicalConversationId(userA, userB), canonicalConversationId(userB, userA));
  assert.equal(canonicalConversationId(userA, userB), [userA, userB].sort().join(":"));
});

test("getOtherParticipantId returns only the other participant in a canonical thread", () => {
  assert.equal(getOtherParticipantId(canonicalConversationId(userA, userB), userA), userB);
  assert.equal(getOtherParticipantId(canonicalConversationId(userA, userB), userB), userA);
});

test("getOtherParticipantId rejects a thread that does not include the current user", () => {
  assert.equal(getOtherParticipantId(canonicalConversationId(userB, userC), userA), null);
});

test("getOtherParticipantId rejects malformed, duplicate, and non-canonical participant IDs", () => {
  assert.equal(getOtherParticipantId("not-an-id", userA), null);
  assert.equal(getOtherParticipantId(`${userA}:${userA}`, userA), null);
  assert.equal(getOtherParticipantId(`${userB}:${userA}`, userA), null);
  assert.equal(getOtherParticipantId(`${userA}:${userB}: ${userC}`, userA), null);
});
