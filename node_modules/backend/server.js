const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// Import models and worker for alert system
const Alert = require("./models/Alert");
const Product = require("./models/Product");
const User = require("./models/User");
const { checkAlerts } = require("./utils/alertWorker");

/* ======================
   MIDDLEWARE
====================== */
// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // limit login attempts to 100 per 15 minutes (increased for development)
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit searches to 10 per minute
  message: "Too many searches, please try again later.",
});

// Apply rate limiting to all routes
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

/* ======================
   MONGODB CONNECTION
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* ======================
   ROUTES
====================== */
// Apply auth limiter to login/register routes
app.use("/api/auth", authLimiter, require("./routes/auth"));

// Apply search limiter to search routes
app.use("/api/search", searchLimiter, require("./routes/search"));

// Regular API routes with default limiter
app.use("/api", require("./routes/alerts"));

/* ======================
   HEALTH CHECK
====================== */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/* ======================
   PRICE ALERT CRON JOB
====================== */
// Run every 30 minutes to check for price drops
cron.schedule("*/30 * * * *", async () => {
  console.log("⏰ Running scheduled price alert check...");
  try {
    await checkAlerts(Alert, Product, User);
    console.log("✅ Price alert check completed");
  } catch (error) {
    console.error("❌ Error in scheduled alert check:", error);
  }
});

// Run once on startup (optional - for testing)
setTimeout(async () => {
  console.log("🔄 Running initial price alert check...");
  try {
    await checkAlerts(Alert, Product, User);
    console.log("✅ Initial alert check completed");
  } catch (error) {
    console.error("❌ Error in initial alert check:", error);
  }
}, 10000); // Wait 10 seconds after server start

/* ======================
   ERROR HANDLING
====================== */
const errorHandler = require("./middleware/errorHandler");

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(
    `📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log("⏰ Price alert checker scheduled (every 30 minutes)");
});

/* ======================
   GRACEFUL SHUTDOWN
====================== */
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
