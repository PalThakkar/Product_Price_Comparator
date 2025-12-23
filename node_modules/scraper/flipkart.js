const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapeFlipkartSearch(query, max = 8, opts = {}) {
  const debug = opts.debug === true;

  const artifactsDir = path.join(
    process.cwd(),
    "apps/backend/scraper_artifacts"
  );
  fs.mkdirSync(artifactsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: !debug,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(
    query
  )}`;
  console.log("[FK] goto:", searchUrl);

  await page.goto(searchUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Close login popup if present
  try {
    await page.waitForSelector("button._2KpZ6l._2doB4z", { timeout: 4000 });
    await page.click("button._2KpZ6l._2doB4z");
    console.log("[FK] login popup closed");
  } catch {
    console.log("[FK] no login popup");
  }

  // Wait for body only (SAFE)
  await page.waitForSelector("body", { timeout: 10000 });

  // Scroll to load products
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  // Save artifacts
  const ts = Date.now();
  await page.screenshot({
    path: path.join(artifactsDir, `flipkart-${ts}.png`),
    fullPage: true,
  });

  fs.writeFileSync(
    path.join(artifactsDir, `flipkart-${ts}.html`),
    await page.content()
  );

// EXTRACT (ROBUST + FLEXIBLE)
  const results = await page.evaluate(() => {
    const items = [];

    const toNum = (s) =>
      Number(String(s || "").replace(/[^\d]/g, "")) || null;

    const links = document.querySelectorAll("a[href*='/p/']");

    links.forEach((link) => {
      const card = link.closest("div");
      if (!card) return;

      const title =
        card.querySelector("div._4rR01T")?.textContent ||
        card.querySelector("a.s1Q9rs")?.textContent ||
        link.textContent;


      let href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        href = "https://www.flipkart.com" + href;
      }

      const image =
        card.querySelector("img")?.getAttribute("src") ||
        card.querySelector("img")?.getAttribute("data-src") ||
        null;

    // ✅ PRICE FIX 
    const cardText = card.innerText || "";
    const priceMatch = cardText.match(/₹\s?[\d,]+/);
    const price = priceMatch
    ? Number(priceMatch[0].replace(/[^\d]/g, ""))
    : null;

      if (!title || !href) return;

      items.push({
        site: "Flipkart",
        title: title.trim(),
        price,
        productUrl: href,
        image,
      });
    });

    return items;
  });

  console.log("[FK] extracted:", results.length);

  await browser.close();

  const clean = results.filter(
  p => p.price != null && p.productUrl && p.title
);

  return results.slice(0, max);
}

module.exports = { scrapeFlipkartSearch };
