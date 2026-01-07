// Script to manually trigger an alert by simulating a price drop
require("dotenv").config();
const mongoose = require("mongoose");
const Alert = require("./models/Alert");
const Product = require("./models/Product");
const User = require("./models/User");
const { checkAlerts } = require("./utils/alertWorker");

async function triggerTestAlert() {
  console.log("🧪 Triggering Test Alert for Email Verification\n");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // Find the washing machine alert for the new user
  const alert = await Alert.findOne({
    user_id: "695e36fbf101d92df8e45a40", // u24cs072@coed.svnit.ac.in
    is_active: true,
  }).populate("product_id");

  if (!alert) {
    console.log("❌ No active alert found for this user");
    await mongoose.disconnect();
    return;
  }

  const product = alert.product_id;
  const user = await User.findById(alert.user_id);

  console.log("📧 User Email:", user.email);
  console.log("📦 Product:", product.title);
  console.log("💰 Original Price:", product.currentPrice);
  console.log("🎯 Target Price:", alert.target_price);
  console.log("");

  // Temporarily set product price to trigger the alert
  const originalPrice = product.currentPrice;
  product.currentPrice = alert.target_price; // Set to target price to trigger
  await product.save();

  console.log("✅ Temporarily set product price to:", product.currentPrice);
  console.log("🔄 Running alert check...\n");

  // Run the alert checker
  await checkAlerts(Alert, Product, User);

  // Restore original price
  const updatedProduct = await Product.findById(product._id);
  updatedProduct.currentPrice = originalPrice;
  await updatedProduct.save();

  console.log("\n✅ Restored original price");
  console.log("\n📬 Check the email inbox: " + user.email);
  console.log("   (Email should arrive within a few seconds)");

  await mongoose.disconnect();
  console.log("\n👋 Disconnected from MongoDB");
}

triggerTestAlert().catch(console.error);
