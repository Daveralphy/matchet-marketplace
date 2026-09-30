require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const ProviderProfile = require("../src/models/ProviderProfile");
const StoreProfile = require("../src/models/StoreProfile");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

  const [sellerUsers, providerUsers] = await Promise.all([
    StoreProfile.distinct("userId"),
    ProviderProfile.distinct("userId"),
  ]);

  const sellerResult = await User.updateMany(
    { _id: { $in: sellerUsers } },
    { $set: { "capabilities.seller": true } },
  );

  const providerResult = await User.updateMany(
    { _id: { $in: providerUsers } },
    { $set: { "capabilities.provider": true } },
  );

  console.log(JSON.stringify({
    sellerUsersFound: sellerUsers.length,
    providerUsersFound: providerUsers.length,
    sellerUsersUpdated: sellerResult.modifiedCount,
    providerUsersUpdated: providerResult.modifiedCount,
  }, null, 2));
}

run()
  .catch((error) => {
    console.error("User capability migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
