// Direct email test - bypass scraping
require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Alert = require("./models/Alert");
const Product = require("./models/Product");
const User = require("./models/User");

async function sendTestEmail() {
  console.log("📧 Sending Test Price Alert Email\n");

  await mongoose.connect(process.env.MONGO_URI);

  // Get the alert for new user
  const alert = await Alert.findOne({
    user_id: "695e36fbf101d92df8e45a40",
  }).populate("product_id");

  const user = await User.findById(alert.user_id);
  const product = alert.product_id;

  console.log("Recipient:", user.email);
  console.log("Product:", product.title);
  console.log("Target Price: ₹" + alert.target_price);
  console.log("");

  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `🔥 Price Drop Alert: ${product.title}`,
    html: `
      <h2>Great News! Price Drop Detected</h2>
      <p><strong>${product.title}</strong> has dropped to your target price!</p>
      <p><strong>Current Price:</strong> ₹${alert.target_price}</p>
      <p><strong>Your Target Price:</strong> ₹${alert.target_price}</p>
      <p><a href="${
        product.url
      }" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Product</a></p>
      <hr style="margin-top: 30px;">
      <p style="color: #666; font-size: 12px;">
        This is a test email from your Price Comparator alert system.<br>
        Sent at: ${new Date().toLocaleString()}
      </p>
    `,
  };

  console.log("Sending email...");
  const info = await transporter.sendMail(mailOptions);

  console.log("✅ Email sent successfully!");
  console.log("Message ID:", info.messageId);
  console.log("\n📬 Check the inbox:", user.email);

  await mongoose.disconnect();
}

sendTestEmail().catch(console.error);
