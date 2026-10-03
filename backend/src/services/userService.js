const User = require("../models/User");

async function getProfile(userId) {
const user = await User.findById(userId);

if (!user) {
const error = new Error("User not found.");
error.statusCode = 404;
throw error;
}

return user;
}

async function updateProfile(userId, updates) {
const allowedUpdates = {};

if (updates.firstName !== undefined) {
allowedUpdates.firstName = updates.firstName;
}

if (updates.lastName !== undefined) {
allowedUpdates.lastName = updates.lastName;
}

if (updates.username !== undefined) {
allowedUpdates.username = updates.username;
}

if (updates.phone !== undefined) {
allowedUpdates.phone = updates.phone;
}

if (updates.avatar !== undefined) {
allowedUpdates.avatar = updates.avatar;
}

if (updates.location !== undefined) {
allowedUpdates.location = updates.location;
}

if (updates.preferences !== undefined) {
if (updates.preferences.notifications !== undefined) {
allowedUpdates["preferences.notifications"] =
updates.preferences.notifications;
}

if (updates.preferences.language !== undefined) {
  allowedUpdates["preferences.language"] =
    updates.preferences.language;
}

if (updates.preferences.paymentMethod !== undefined) {
  allowedUpdates["preferences.paymentMethod"] =
    updates.preferences.paymentMethod;
}

}

const existingUser = await User.findById(userId);

if (!existingUser) {
const error = new Error("User not found.");
error.statusCode = 404;
throw error;
}

const oldAvatar = existingUser.avatar;

const user = await User.findByIdAndUpdate(
userId,
{ $set: allowedUpdates },
{
new: true,
runValidators: true,
},
);

if (
updates.avatar?.publicId &&
oldAvatar?.publicId &&
updates.avatar.publicId !== oldAvatar.publicId
) {
try {
const { deleteFromCloudinary } = require("../config/cloudinary");

  await deleteFromCloudinary({
    publicId: oldAvatar.publicId,
    resourceType: "image",
    accessType: "upload",
  });

  console.log(
    "Old profile picture deleted from Cloudinary:",
    oldAvatar.publicId
  );
} catch (error) {
  console.error("Old profile picture cleanup failed:", error);
}

}

return user;
}

module.exports = {
getProfile,
updateProfile,
};