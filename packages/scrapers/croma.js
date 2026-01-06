const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function scrapeCromaSearch(query, max = 8, opts = {}) {
  const debug = opts.debug === true;

  const artifactsDir = path.join(
    process.cwd(),
    "apps/backend/scraper_artifacts"
  );
  fs.mkdirSync(artifactsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 900 });

  const searchUrl = `https://www.croma.com/search/?q=${encodeURIComponent(
    query
  )}`;
  console.log("[CRM] goto:", searchUrl);
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-IN,en;q=0.9",
  });

  await page.goto(searchUrl, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  console.log("[CRM] waiting for product prices...");
  await page.waitForFunction(() => document.body.innerText.includes("₹"), {
    timeout: 30000,
  });

  // Scroll to load lazy content
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 500;
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

  // Save artifacts for debugging
  const ts = Date.now();
  await page.screenshot({
    path: path.join(artifactsDir, `croma-${ts}.png`),
    fullPage: true,
  });
  fs.writeFileSync(
    path.join(artifactsDir, `croma-${ts}.html`),
    await page.content(),
    "utf8"
  );

  // Extract products (CARD-BASED)
  const results = await page.evaluate(() => {
    const items = [];

    const toNum = (s) => Number(String(s || "").replace(/[^\d]/g, "")) || null;

    // Find all nodes containing prices
    const priceNodes = Array.from(document.querySelectorAll("*")).filter(
      (el) => el.innerText && el.innerText.match(/₹\s?[\d,]+/)
    );

    priceNodes.forEach((priceEl) => {
      const priceText = priceEl.innerText.match(/₹\s?[\d,]+/)?.[0];
      const price = toNum(priceText);
      if (!price) return;

      // Walk up to find a clickable parent
      let parent = priceEl;
      for (let i = 0; i < 6; i++) {
        parent = parent.parentElement;
        if (!parent) break;

        const link = parent.querySelector("a[href]");
        const title =
          parent.querySelector("h3")?.innerText ||
          parent.querySelector("p")?.innerText ||
          link?.innerText;

        const image =
          parent.querySelector("img")?.src ||
          parent.querySelector("img")?.getAttribute("data-src");

        if (link && title) {
          items.push({
            site: "Croma",
            title: title.trim(),
            productUrl: link.href,
            price,
            image: image || null,
          });
          break;
        }
      }
    });

    return items;
  });
  const hasPrice = await page.evaluate(() =>
    document.body.innerText.includes("₹")
  );
  console.log("[CRM] page contains price symbol:", hasPrice);

  console.log("[CRM] extracted:", results.length);

  await browser.close();

  return results.slice(0, max);
}

module.exports = { scrapeCromaSearch };
