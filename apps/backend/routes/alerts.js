const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { checkAlerts } = require("../utils/alertWorker");
const PDFDocument = require("pdfkit");
const { stringify } = require("csv-stringify/sync");

// GET all alerts for logged-in user
router.get("/alerts", auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ user_id: req.user.id, is_active: true })
      .populate("product_id")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// POST create new alert
router.post("/alerts", auth, async (req, res) => {
  try {
    const { product_id, target_price } = req.body;

    console.log("Creating alert:", {
      product_id,
      target_price,
      user_id: req.user.id,
    });

    if (!product_id || !target_price) {
      return res
        .status(400)
        .json({ error: "product_id and target_price are required" });
    }

    // Verify product exists
    const product = await Product.findById(product_id);
    if (!product) {
      console.error("Product not found:", product_id);
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate target price is less than or equal to current price
    if (Number(target_price) > product.currentPrice) {
      return res.status(400).json({
        error: `Target price must be less than or equal to current price (₹${product.currentPrice}). You set ₹${target_price}.`,
      });
    }

    // Check if alert already exists
    const existing = await Alert.findOne({
      user_id: req.user.id,
      product_id,
      is_active: true,
    });

    if (existing) {
      console.log(
        "Alert already exists for user:",
        req.user.id,
        "product:",
        product_id
      );
      return res
        .status(400)
        .json({ error: "Alert already exists for this product" });
    }

    const alert = await Alert.create({
      user_id: req.user.id,
      product_id,
      target_price: Number(target_price),
    });

    console.log("Alert created successfully:", alert._id);

    const populated = await Alert.findById(alert._id).populate("product_id");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating alert:", error);
    res
      .status(500)
      .json({ error: "Failed to create alert", details: error.message });
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// PATCH update alert
router.patch("/alerts/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { target_price, is_active } = req.body;

    const alert = await Alert.findOne({ _id: id, user_id: req.user.id });
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    if (target_price !== undefined) alert.target_price = Number(target_price);
    if (is_active !== undefined) alert.is_active = is_active;

    await alert.save();
    const populated = await Alert.findById(alert._id).populate("product_id");
    res.json(populated);
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

// DELETE alert
router.delete("/alerts/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findOne({ _id: id, user_id: req.user.id });

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    await Alert.deleteOne({ _id: id });
    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

// GET all products (for alert management)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ lastScrapedAt: -1 })
      .limit(100);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST manual trigger to check alerts now (for testing)
router.post("/alerts/check-now", auth, async (req, res) => {
  try {
    console.log("🔄 Manual alert check triggered by user:", req.user.id);

    // Run the alert checker
    await checkAlerts(Alert, Product, User);

    res.json({
      message: "Alert check completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in manual alert check:", error);
    res
      .status(500)
      .json({ error: "Failed to check alerts", details: error.message });
  }
});

// GET export alerts as CSV
router.get("/alerts/export/csv", auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ user_id: req.user.id })
      .populate("product_id")
      .sort({ createdAt: -1 });

    // Transform data for CSV
    const csvData = alerts.map((alert) => ({
      "Product Name": alert.product_id?.title || "N/A",
      "Current Price": alert.product_id?.currentPrice || "N/A",
      "Target Price": alert.target_price,
      Status: alert.is_active ? "Active" : "Inactive",
      "Created Date": new Date(alert.createdAt).toLocaleDateString(),
      "Triggered Date": alert.triggered_at
        ? new Date(alert.triggered_at).toLocaleDateString()
        : "Not triggered",
      Retailer: alert.product_id?.site || "N/A",
      "Product URL": alert.product_id?.url || "N/A",
    }));

    const csv = stringify(csvData, {
      header: true,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=price-alerts.csv"
    );
    res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export alerts" });
  }
});

// GET export price history as CSV
router.get(
  "/alerts/export/price-history/:product_id",
  auth,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.product_id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Transform price history for CSV
      const csvData = product.priceHistory.map((item) => ({
        Date: new Date(item.at).toLocaleString("en-IN"),
        Price: item.price,
        "Current Price": product.currentPrice,
      }));

      const csv = stringify(csvData, {
        header: true,
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=price-history-${product.title.replace(
          /\s+/g,
          "-"
        )}.csv`
      );
      res.send(csv);
    } catch (error) {
      console.error("Error exporting price history:", error);
      res.status(500).json({ error: "Failed to export price history" });
    }
  }
);

// GET export alerts as PDF
router.get("/alerts/export/pdf", auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ user_id: req.user.id })
      .populate("product_id")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument();

    // Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=price-alerts.pdf"
    );
    doc.pipe(res);

    // Title
    doc.fontSize(20).font("Helvetica-Bold").text("Price Alerts Report", {
      align: "center",
    });
    doc.moveDown();
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, {
        align: "center",
      });
    doc.moveDown();

    // Summary
    doc.fontSize(12).font("Helvetica-Bold").text("Summary", {
      underline: true,
    });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Total Alerts: ${alerts.length}`, { indent: 10 })
      .text(`Active Alerts: ${alerts.filter((a) => a.is_active).length}`, {
        indent: 10,
      })
      .text(
        `Triggered Alerts: ${alerts.filter((a) => a.triggered_at).length}`,
        {
          indent: 10,
        }
      );
    doc.moveDown();

    // Alert Details
    doc.fontSize(12).font("Helvetica-Bold").text("Alert Details", {
      underline: true,
    });
    doc.moveDown(0.5);

    alerts.forEach((alert, index) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(`${index + 1}. ${alert.product_id?.title || "Unknown Product"}`, {
          underline: true,
        });
      doc
        .fontSize(9)
        .font("Helvetica")
        .text(`Current Price: ₹${alert.product_id?.currentPrice || "N/A"}`, {
          indent: 10,
        })
        .text(`Target Price: ₹${alert.target_price}`, { indent: 10 })
        .text(`Status: ${alert.is_active ? "Active" : "Inactive"}`, {
          indent: 10,
        })
        .text(`Created: ${new Date(alert.createdAt).toLocaleDateString()}`, {
          indent: 10,
        })
        .text(
          `Triggered: ${
            alert.triggered_at
              ? new Date(alert.triggered_at).toLocaleDateString()
              : "Not triggered"
          }`,
          { indent: 10 }
        )
        .text(`Retailer: ${alert.product_id?.site || "N/A"}`, {
          indent: 10,
        });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ error: "Failed to export PDF" });
  }
});

// GET price suggestion for a product
router.get("/suggestions/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get price history
    const priceHistory = product.priceHistory || [];
    if (priceHistory.length === 0) {
      return res.json({
        currentPrice: product.currentPrice,
        suggestedPrice: Math.floor(product.currentPrice * 0.9), // 10% discount
        minPrice: product.currentPrice,
        maxPrice: product.currentPrice,
        avgPrice: product.currentPrice,
        reasoning: "Suggest 10% below current price (no history available)",
      });
    }

    // Calculate statistics
    const prices = priceHistory.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(
      prices.reduce((a, b) => a + b, 0) / prices.length
    );

    // Suggest price: 5% below average or 10% below minimum, whichever is lower
    const belowAvg = Math.floor(avgPrice * 0.95);
    const belowMin = Math.floor(minPrice * 0.9);
    const suggestedPrice = Math.min(belowAvg, belowMin);

    res.json({
      currentPrice: product.currentPrice,
      suggestedPrice,
      minPrice,
      maxPrice,
      avgPrice,
      priceDropPercentage: Math.round(
        ((product.currentPrice - suggestedPrice) / product.currentPrice) * 100
      ),
      reasoning: `Based on ${priceHistory.length} price points. Min: ₹${minPrice}, Max: ₹${maxPrice}, Avg: ₹${avgPrice}`,
    });
  } catch (error) {
    console.error("Error getting price suggestion:", error);
    res.status(500).json({ error: "Failed to get price suggestion" });
  }
});

module.exports = router;
