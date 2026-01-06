const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, unique: true, required: true },
    site: String,
    currentPrice: Number,
    image: String,
    priceHistory: [{ price: Number, at: Date }],
    lastScrapedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
