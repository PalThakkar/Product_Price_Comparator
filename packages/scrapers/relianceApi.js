// packages/scrapers/relianceApi.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const SAVE_ARTIFACTS = process.env.SAVE_SCRAPER_ARTIFACTS === "true";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toNum = (s) => {
  const n = Number(String(s || "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// artifacts ko hamesha apps/backend/scraper_artifacts me save karo
const ART_DIR = path.resolve(__dirname, "../../apps/backend/scraper_artifacts");

async function saveArtifacts(page, label, { force = false } = {}) {
  if (!SAVE_ARTIFACTS && !force) return;
  try {
    if (!fs.existsSync(ART_DIR)) fs.mkdirSync(ART_DIR, { recursive: true });
    const ts = Date.now();
    await page.screenshot({
      path: path.join(ART_DIR, `${label}-${ts}.png`),
      fullPage: true,
    });
    const html = await page.content();
    fs.writeFileSync(path.join(ART_DIR, `${label}-${ts}.html`), html);
  } catch (e) {
    console.error("Save artifacts error:", e.message);
  }
}

async function scrapeRelianceSearch(query, max = 8) {
  let browser;
  try {
    console.log("▶️ Calling Reliance...");

    const launchOpts = {
      headless: true,
      slowMo: 0,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    browser = await puppeteer.launch(launchOpts);
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({ "Accept-Language": "en-IN,en;q=0.9" });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    const searchUrl = `https://www.reliancedigital.in/search?q=${encodeURIComponent(
      query
    )}`;
    console.log("🔍 Reliance URL:", searchUrl);

    try {
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });
      console.log("✅ Page loaded successfully");
    } catch (navError) {
      console.error("❌ Page navigation failed:", navError.message);
      return [];
    }

    // Save artifacts before waiting for selector
    await saveArtifacts(page, "reliance-before-wait");

    // Wait for products to load
    await page
      .waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
      .catch(() => {});

    await saveArtifacts(page, "reliance-search");

    // Wait a bit more for dynamic content to load
    await sleep(3000);

    // Extract products
    console.log("Starting page.evaluate...");
    console.log("Page is closed?", page.isClosed());

    // First, try a simple page.evaluate to test if it works
    try {
      const testResult = await page.evaluate(() => {
        console.log("Simple test: page.evaluate is working");
        return document.title;
      });
      console.log("Simple test result:", testResult);
    } catch (testErr) {
      console.error("Simple test failed:", testErr.message);
    }

    const products = await page
      .evaluate(() => {
        console.log("Inside main page.evaluate - Reliance");

        // Look for product elements - try different selectors
        const selectors = [
          'a[href*="/p/"]', // Product links
          'a[href*="product"]',
          ".product-item",
          ".product-card",
          "[data-product]",
          '[class*="product"]',
        ];

        let allProducts = [];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          console.log(
            `Selector "${selector}" found ${elements.length} elements`
          );

          for (let i = 0; i < Math.min(elements.length, 10); i++) {
            const el = elements[i];

            // Try to extract title
            let title = "";
            const titleEl =
              el.querySelector('h3, h4, .title, [class*="title"]') || el;
            if (titleEl) {
              title =
                titleEl.textContent?.trim() ||
                titleEl.getAttribute("title") ||
                "";
            }

            // Try to extract price
            let price = null;
            const priceEl = el.querySelector(
              '.price, [class*="price"], .rupee, [class*="rupee"]'
            );
            if (priceEl) {
              const priceText = priceEl.textContent?.trim() || "";
              const priceMatch = priceText.match(/₹?\s*[\d,]+/);
              if (priceMatch) {
                price = parseInt(priceMatch[0].replace(/[^\d]/g, ""));
              }
            }

            // Get URL
            let url = "";
            if (el.tagName === "A") {
              url = el.href;
            } else {
              const linkEl = el.querySelector("a[href]");
              if (linkEl) url = linkEl.href;
            }

            // Get image
            let image = "";
            const imgEl = el.querySelector("img");
            if (imgEl) image = imgEl.src;

            // Only add if we have title and URL and title contains iphone
            if (title && url && title.toLowerCase().includes("iphone")) {
              allProducts.push({
                title: title.substring(0, 100), // Limit title length
                price,
                productUrl: url,
                image,
              });
            }
          }
        }

        // Remove duplicates and limit to 8
        const uniqueProducts = [];
        const seenUrls = new Set();

        for (const product of allProducts) {
          if (!seenUrls.has(product.productUrl)) {
            seenUrls.add(product.productUrl);
            uniqueProducts.push(product);
            if (uniqueProducts.length >= 8) break;
          }
        }

        console.log("Final Reliance products:", uniqueProducts.length);
        return uniqueProducts;
      })
      .catch((err) => {
        console.error("page.evaluate failed:", err.message);
        return [];
      });

    console.log("✅ Reliance extracted:", products.length);
    console.log("🧪 Reliance sample:", products[0]);

    return products.map((p) => ({
      site: "Reliance Digital",
      title: p.title,
      price: p.price,
      image: p.image,
      productUrl: p.productUrl,
    }));
  } catch (err) {
    console.error("❌ Reliance ERROR:", err.message);
    // Save error artifacts if browser is still available
    if (browser) {
      try {
        const page = await browser.newPage();
        await page
          .goto(searchUrl, { waitUntil: "networkidle2", timeout: 10000 })
          .catch(() => {});
        await saveArtifacts(page, "reliance-error", { force: true });
      } catch (e) {
        console.error("Failed to save error artifacts:", e.message);
      }
    }
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeRelianceSearch };
