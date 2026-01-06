const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Import scrapers from the packages directory
const { scrapeAmazonSearch } = require("../../../packages/scrapers/amazon");
const { scrapeFlipkartSearch } = require("../../../packages/scrapers/flipkart");
const { scrapeCromaSearch } = require("../../../packages/scrapers/croma");

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase().trim();

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    console.log("🔍 Searching for:", query);

    // SCRAPE IN PARALLEL
    const results = await Promise.allSettled([
      scrapeAmazonSearch(query),
      scrapeFlipkartSearch(query),
      scrapeCromaSearch(query),
    ]);

    const products = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value || []);

    // SAVE PRODUCTS TO DATABASE (upsert by URL)
    const savedProducts = [];
    for (const product of products) {
      if (!product.productUrl || !product.price) continue;

      try {
        const saved = await Product.findOneAndUpdate(
          { url: product.productUrl },
          {
            title: product.title,
            url: product.productUrl,
            site: product.site,
            currentPrice: product.price,
            image: product.image,
            lastScrapedAt: new Date(),
            $push: {
              priceHistory: {
                price: product.price,
                at: new Date(),
              },
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        savedProducts.push({
          _id: saved._id,
          title: saved.title,
          productUrl: saved.url,
          site: saved.site,
          price: saved.currentPrice,
          currentPrice: saved.currentPrice,
          image: saved.image,
        });
      } catch (err) {
        console.error("Error saving product:", err);
        // If save fails, still include the product without _id
        savedProducts.push(product);
      }
    }

    // COUNT BY SITE
    const counts = {
      amazon: savedProducts.filter((p) => p.site === "Amazon").length,
      flipkart: savedProducts.filter((p) => p.site === "Flipkart").length,
      croma: savedProducts.filter((p) => p.site === "Croma").length,
      reliance: savedProducts.filter((p) => p.site === "Reliance").length,
    };

    // SORT LOWEST PRICE FIRST
    savedProducts.sort((a, b) => a.price - b.price);

    console.log(`✅ Found ${savedProducts.length} products`);
    res.json({
      results: savedProducts,
      amazon: counts.amazon,
      flipkart: counts.flipkart,
      croma: counts.croma,
      reliance: counts.reliance,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed", message: error.message });
  }
});

module.exports = router;
