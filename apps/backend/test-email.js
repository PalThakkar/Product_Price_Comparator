// Quick email test script
require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("📧 Testing Email Configuration...\n");

// Check if credentials exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS not set in .env");
  process.exit(1);
}

console.log(`Using EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(
  `EMAIL_PASS: ${process.env.EMAIL_PASS ? "***configured***" : "NOT SET"}\n`
);

// Create transporter (same as alertWorker.js)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test 1: Verify connection
console.log("🔍 Test 1: Verifying SMTP connection...");
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n💡 Common issues:");
    console.log(
      "   - App Password not generated (use regular Gmail password won't work)"
    );
    console.log("   - 2FA not enabled on Gmail account");
    console.log("   - Wrong password copied");
    console.log("   - Spaces in password (remove them)");
    process.exit(1);
  } else {
    console.log("✅ SMTP connection successful!\n");

    // Test 2: Send actual test email
    console.log("📨 Test 2: Sending test email...");
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: "✅ Price Comparator - Email Test",
      html: `
        <h2>Email Configuration Successful! 🎉</h2>
        <p>Your Price Alert system is ready to send notifications.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This is a test email from your Price Comparator backend.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Failed to send email:", error.message);
        process.exit(1);
      } else {
        console.log("✅ Email sent successfully!");
        console.log(`📬 Message ID: ${info.messageId}`);
        console.log(`\n👉 Check your inbox at: ${process.env.EMAIL_USER}`);
        console.log("   (May take a few seconds to arrive)\n");
      }
    });
  }
});
