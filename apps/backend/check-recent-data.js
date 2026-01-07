require("dotenv").config();
const mongoose = require("mongoose");
const Alert = require("./models/Alert");
const User = require("./models/User");
const Product = require("./models/Product");

async function checkData() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("\n=== RECENT USERS ===");
  const users = await User.find().sort({ createdAt: -1 }).limit(5);
  users.forEach((u) => {
    console.log(`Email: ${u.email}`);
    console.log(`ID: ${u._id}`);
    console.log(`Created: ${u.createdAt}\n`);
  });

  console.log("\n=== RECENT ALERTS ===");
  const alerts = await Alert.find()
    .populate("product_id")
    .sort({ createdAt: -1 })
    .limit(5);
  for (const a of alerts) {
    console.log(`User ID: ${a.user_id}`);
    console.log(`Product: ${a.product_id?.title || "N/A"}`);
    console.log(`Target Price: ₹${a.target_price}`);
    console.log(`Current Price: ₹${a.product_id?.currentPrice || "N/A"}`);
    console.log(`Active: ${a.is_active}`);
    console.log(`Created: ${a.createdAt}`);

    // Get user email
    const user = await User.findById(a.user_id);
    console.log(`User Email: ${user?.email || "Not found"}\n`);
  }

  await mongoose.disconnect();
}

checkData().catch(console.error);
