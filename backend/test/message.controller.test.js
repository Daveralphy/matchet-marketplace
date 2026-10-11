const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Message = require("../src/models/Message");
const User = require("../src/models/User");
const Order = require("../src/models/Order");
const Booking = require("../src/models/Booking");
const controller = require("../src/controllers/message.controller");

const userA = "64b000000000000000000001";
const userB = "64b000000000000000000002";
const userC = "64b000000000000000000003";

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function stub(object, key, replacement) {
  const original = object[key];
  object[key] = replacement;
  return () => { object[key] = original; };
}

test("canonicalConversationId is stable regardless of participant order", () => {
  assert.equal(controller.canonicalConversationId(userA, userB), controller.canonicalConversationId(userB, userA));
  assert.equal(controller.canonicalConversationId(userA, userB), [userA, userB].sort().join(":"));
});

test("getOtherParticipantId returns only the other participant in a canonical thread", () => {
  assert.equal(controller.getOtherParticipantId(controller.canonicalConversationId(userA, userB), userA), userB);
  assert.equal(controller.getOtherParticipantId(controller.canonicalConversationId(userA, userB), userB), userA);
});

test("getOtherParticipantId rejects unrelated, malformed, duplicate, and non-canonical IDs", () => {
  assert.equal(controller.getOtherParticipantId(controller.canonicalConversationId(userB, userC), userA), null);
  assert.equal(controller.getOtherParticipantId("not-an-id", userA), null);
  assert.equal(controller.getOtherParticipantId(`${userA}:${userA}`, userA), null);
  assert.equal(controller.getOtherParticipantId(`${userB}:${userA}`, userA), null);
  assert.equal(controller.getOtherParticipantId(`${userA}:${userB}: ${userC}`, userA), null);
});

test("sendMessage rejects self-messaging before database access", async () => {
  const res = responseRecorder();
  await controller.sendMessage({ user: { _id: new mongoose.Types.ObjectId(userA) }, body: { receiverId: userA, content: "Hello" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
});

test("sendMessage rejects malformed recipient IDs", async () => {
  const res = responseRecorder();
  await controller.sendMessage({ user: { _id: new mongoose.Types.ObjectId(userA) }, body: { receiverId: "bad-id", content: "Hello" } }, res);
  assert.equal(res.statusCode, 400);
});

test("sendMessage blocks unrelated accounts from starting a thread", async (t) => {
  const restores = [
    stub(User, "findById", () => ({ select: () => ({ lean: async () => ({ _id: new mongoose.Types.ObjectId(userB), isActive: true }) }) })),
    stub(Message, "exists", async () => false),
    stub(Order, "exists", async () => false),
    stub(Booking, "exists", async () => false),
  ];
  t.after(() => restores.reverse().forEach((restore) => restore()));
  const res = responseRecorder();
  await controller.sendMessage({ user: { _id: new mongoose.Types.ObjectId(userA) }, body: { receiverId: userB, content: "Hello" } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.code, "MESSAGE_RELATIONSHIP_REQUIRED");
});

test("getUnreadCount returns only the count provided by the current user's query", async (t) => {
  let query;
  const restore = stub(Message, "countDocuments", async (value) => { query = value; return 3; });
  t.after(restore);
  const res = responseRecorder();
  await controller.getUnreadCount({ user: { _id: new mongoose.Types.ObjectId(userA) } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.unreadCount, 3);
  assert.equal(String(query.receiverId), userA);
  assert.equal(query.readAt, null);
});

test("getConversation rejects conversation IDs that do not include the authenticated user", async () => {
  const res = responseRecorder();
  await controller.getConversation({
    user: { _id: new mongoose.Types.ObjectId(userA) },
    params: { conversationId: controller.canonicalConversationId(userB, userC) },
    query: {},
  }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, "Conversation not found.");
});

test("getConversation paginates newest messages and returns a stable cursor", async (t) => {
  const idA = new mongoose.Types.ObjectId(userA);
  const idB = new mongoose.Types.ObjectId(userB);
  const older = { _id: new mongoose.Types.ObjectId("64b000000000000000000011"), senderId: { _id: idA, firstName: "Buyer" }, receiverId: { _id: idB, firstName: "Seller" }, content: "older", createdAt: new Date("2026-01-01T10:00:00.000Z"), attachments: [] };
  const newer = { _id: new mongoose.Types.ObjectId("64b000000000000000000012"), senderId: { _id: idB, firstName: "Seller" }, receiverId: { _id: idA, firstName: "Buyer" }, content: "newer", createdAt: new Date("2026-01-01T10:00:00.000Z"), attachments: [] };
  let appliedLimit;
  const query = {
    sort() { return this; },
    limit(value) { appliedLimit = value; return this; },
    populate() { return this; },
    lean: async () => [newer, older],
  };
  const restores = [
    stub(Message, "find", () => query),
    stub(Message, "updateMany", async () => ({ modifiedCount: 1 })),
  ];
  t.after(() => restores.reverse().forEach((restore) => restore()));
  const res = responseRecorder();
  await controller.getConversation({
    user: { _id: idA },
    params: { conversationId: controller.canonicalConversationId(userA, userB) },
    query: { limit: "1" },
  }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(appliedLimit, 2);
  assert.equal(res.body.data.messages.length, 1);
  assert.equal(res.body.data.messages[0].content, "newer");
  assert.equal(res.body.data.pagination.hasMore, true);
  assert.equal(String(res.body.data.pagination.nextBeforeId), String(newer._id));
});

test("getConversation rejects malformed pagination cursors", async () => {
  const res = responseRecorder();
  await controller.getConversation({
    user: { _id: new mongoose.Types.ObjectId(userA) },
    params: { conversationId: controller.canonicalConversationId(userA, userB) },
    query: { before: "not-a-date" },
  }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "The message history cursor is invalid.");
});
