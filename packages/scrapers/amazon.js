// packages/scrapers/amazon.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toNum = (s) => {
  const n = Number(String(s || "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const SAVE_ARTIFACTS = process.env.SAVE_SCRAPER_ARTIFACTS === "true";

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
    fs.writeFileSync(path.join(ART_DIR, `${label}-${ts}.html`), html, "utf8");
    console.log("[AMZ] artifacts saved at:", ART_DIR);
  } catch (e) {
    console.warn("[AMZ] artifact save failed:", e.message);
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 600;
      const timer = setInterval(() => {
        const sh = document.body.scrollHeight;
        window.scrollBy(0, distance);
        total += distance;
        if (total + window.innerHeight >= sh) {
          clearInterval(timer);
          resolve();
        }
      }, 180);
    });
  });
}

async function scrapeAmazonSearch(query, max = 8, { debug = false } = {}) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(
    query
  )}&ref=nb_sb_noss`;

  const launchOpts = {
    headless: debug ? false : "new",
    slowMo: debug ? 80 : 0,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  };
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();

  try {
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-IN,en;q=0.9" });
    // @ts-ignore (deprecated warning is fine)
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 900 });

    console.log("[AMZ] goto:", url);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });

    // Captcha?
    if (await page.$('form[action="/errors/validateCaptcha"]')) {
      console.warn("[AMZ] captcha page detected");
      await saveArtifacts(page, "captcha", { force: true });
      return [];
    }

    // Main slot ya title visible
    await Promise.race([
      page.waitForSelector("div.s-main-slot", { timeout: 30000 }),
      page.waitForSelector("h2 a span", { timeout: 30000 }),
    ]);

    // Lazy content ke liye thoda wait + scroll
    await sleep(1000);
    await autoScroll(page);
    await sleep(700);

    // Debug info
    const title = await page.title();
    const cardCount = await page
      .$$eval(
        'div.s-main-slot div.s-result-item[data-component-type="s-search-result"]',
        (els) => els.length
      )
      .catch(() => 0);
    console.log("[AMZ] title:", title);
    console.log("[AMZ] cardCount:", cardCount);

    await saveArtifacts(page, "search");

    // Extract
    //     const results = await page.evaluate(() => {
    //       const items = [];
    //       const cards = document.querySelectorAll(
    //         'div.s-main-slot > div[data-asin][data-component-type="s-search-result"]'
    //       );
    //       const toNum = (s) => Number(String(s || "").replace(/[^\d]/g, "")) || null;

    //       for (const c of cards) {
    //         const titleEl = c.querySelector("h2 a span");
    //         const linkEl = c.querySelector("h2 a.a-link-normal") || c.querySelector("h2 a");
    //         const priceEl = c.querySelector(".a-price .a-offscreen") || c.querySelector(".a-price > .a-price-whole");
    //         const imgEl = c.querySelector("img.s-image") || c.querySelector("img");

    //         const title = titleEl?.textContent?.trim() || null;
    //         const href = linkEl?.href || null;
    //         const priceText = priceEl?.textContent || "";
    //         const img = imgEl?.getAttribute("src") || null;

    //         if (title && href) {
    //           items.push({
    //             site: "Amazon",
    //             title,
    //             productUrl: href,
    //             price: toNum(priceText),
    //             image: img,
    //           });
    //         }
    //       }
    //       return items;
    //     });

    //     console.log("[AMZ] extracted:", results.length);
    //     return results.slice(0, max);
    //   } catch (e) {
    //     console.error("[AMZ] error:", e);
    //     await saveArtifacts(page, "error");
    //     throw e;
    //   } finally {
    //     await browser.close();
    //   }
    // }

    // Extract (tolerant): use ASIN fallback for URL, multiple title/price selectors
    const results = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll(
        'div.s-main-slot > div[data-asin][data-component-type="s-search-result"]'
      );

      const toNum = (s) =>
        Number(String(s || "").replace(/[^\d]/g, "")) || null;

      for (const c of cards) {
        const asin = c.getAttribute("data-asin") || "";
        // common title locations
        const titleEl =
          c.querySelector("h2 a span") ||
          c.querySelector("span.a-size-base-plus.a-color-base.a-text-normal") ||
          c.querySelector("span.a-size-medium.a-color-base.a-text-normal") ||
          null;

        // common link locations
        const linkEl =
          c.querySelector("h2 a.a-link-normal") ||
          c.querySelector("h2 a") ||
          c.querySelector("a.a-link-normal.s-no-outline") ||
          null;

        // price fallbacks
        const priceEl =
          c.querySelector(".a-price .a-offscreen") ||
          c.querySelector(".a-price > .a-price-whole") ||
          c.querySelector("span.a-offscreen") ||
          null;

        const imgEl = c.querySelector("img.s-image") || c.querySelector("img");

        const title =
          (titleEl && titleEl.textContent && titleEl.textContent.trim()) ||
          (imgEl && imgEl.getAttribute("alt")) ||
          null;

        let href = linkEl && linkEl.getAttribute("href");
        // absolute URL or make from ASIN
        if (href && !href.startsWith("http")) {
          href = "https://www.amazon.in" + href;
        }
        if ((!href || href === "https://www.amazon.in#") && asin) {
          href = `https://www.amazon.in/dp/${asin}`;
        }

        const priceText = (priceEl && priceEl.textContent) || "";
        const image = (imgEl && imgEl.getAttribute("src")) || null;
        const price = toNum(priceText);

        // Push if we at least have a URL and some title text
        if (href && title) {
          items.push({
            site: "Amazon",
            title,
            productUrl: href,
            price,
            image,
          });
        }
      }
      return items;
    });

    console.log("[AMZ] extracted:", results.length);
    if (results.length) {
      console.log(
        "[AMZ] sample:",
        results
          .slice(0, 3)
          .map((r) => ({
            t: r.title?.slice(0, 50),
            p: r.price,
            u: r.productUrl,
          }))
      );
    }
    return results.slice(0, max);
  } catch (e) {
    console.error("[AMZ] error:", e);
    await saveArtifacts(page, "error", { force: true });
    throw e;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeAmazonSearch };
