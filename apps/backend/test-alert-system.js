// Test script for Price Alert System
// Run with: node test-alert-system.js

require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const User = require("./models/User");

// Define schemas (same as in server.js)
const productSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, unique: true, required: true },
    site: String,
    currentPrice: Number,
    priceHistory: [{ price: Number, at: Date }],
    lastScrapedAt: Date,
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

const alertSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    target_price: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    triggered_at: Date,
  },
  { timestamps: true }
);
const Alert = mongoose.model("Alert", alertSchema);

// Import worker
const { checkAlerts } = require("./utils/alertWorker");

async function testAlertSystem() {
  console.log("🧪 Testing Price Alert System...\n");

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️  EMAIL_USER or EMAIL_PASS not configured in .env");
      console.warn(
        "   Emails will NOT be sent. Configure them to enable notifications.\n"
      );
    } else {
      console.log("✅ Email configuration found");
      console.log(`   Using: ${process.env.EMAIL_USER}\n`);
    }

    // Check for existing alerts
    const alertCount = await Alert.countDocuments({ is_active: true });
    console.log(`📊 Active alerts in database: ${alertCount}`);

    if (alertCount === 0) {
      console.log("\n💡 No active alerts found. Create one to test:");
      console.log("   1. Register/login a user");
      console.log("   2. Search for a product");
      console.log("   3. Create an alert with a target price");
      console.log("   4. Run this test again\n");
    } else {
      console.log("\n🔄 Running checkAlerts worker...\n");

      // Run the worker
      await checkAlerts(Alert, Product, User);

      console.log(
        "\n✅ Test complete! Check console output above for results."
      );
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run test
testAlertSystem();
