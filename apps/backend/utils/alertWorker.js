const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

// Robust price parser: preserves decimals, strips currency/commas, returns rupees as integer
function parsePrice(text) {
  if (!text) return null;
  const s = String(text).replace(/₹/g, "").replace(/,/g, "").trim();
  const m = s.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!isFinite(value)) return null;
  // Round to nearest rupee
  return Math.round(value);
}

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to scrape a specific URL directly
async function scrapeCurrentPrice(url, site) {
  console.log(`[Worker] Scraping ${url} (${site})`);
  // Simple Puppeteer generic scrape
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    );

    // Set a reasonable timeout
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Generic selector logic based on site
    let priceText = null;

    // Wait a bit for dynamic content
    await new Promise((r) => setTimeout(r, 2000));

    if (site === "Amazon" || url.includes("amazon")) {
      const el =
        (await page.$(".a-price .a-offscreen")) ||
        (await page.$(".a-price > .a-price-whole"));
      if (el)
        priceText = await (await el.getProperty("textContent")).jsonValue();
    } else if (site === "Flipkart" || url.includes("flipkart")) {
      const el =
        (await page.$("div._30jeq3._16Jk6d")) || (await page.$("div._30jeq3"));
      if (el)
        priceText = await (await el.getProperty("textContent")).jsonValue();
    } else if (site === "Croma" || url.includes("croma")) {
      // Croma selectors might vary, relying on common patterns or previous scraper knowledge
      // From cromaApi.js it seems they use API, but for direct page visit:
      const el = await page.$(".amount"); // Verify if correct?
      // If Croma uses API only, this might fail. We'll try generic fallback.
      if (el)
        priceText = await (await el.getProperty("textContent")).jsonValue();
    } else if (site === "Reliance" || url.includes("digital")) {
      // reliancedigital
      const el = await page.$(".pdp__priceSection__priceListText");
      if (el)
        priceText = await (await el.getProperty("textContent")).jsonValue();
    }

    // Fallback: try common price meta tags and page text if specific failed
    if (!priceText) {
      // Meta price
      priceText = await page
        .$eval('meta[itemprop="price"]', (el) => el.getAttribute("content"))
        .catch(() => null);
    }
    if (!priceText) {
      // Look for first INR-looking price in body text
      const bodyText = await page.evaluate(() => document.body.innerText);
      const m = bodyText && bodyText.match(/₹\s?[\d,]+(?:\.\d+)?/);
      if (m) priceText = m[0];
    }

    if (priceText) {
      const price = parsePrice(priceText);
      if (price != null) {
        console.log(`[Worker] Extracted price: ${price}`);
        return price;
      }
    }

    return null;
  } catch (err) {
    console.error(`[Worker] Failed to scrape ${url}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

async function checkAlerts(Alert, Product, User) {
  console.log("⏰ Running checkAlerts job...");
  try {
    const alerts = await Alert.find({ is_active: true }).populate("product_id");
    console.log(`Found ${alerts.length} active alerts.`);

    for (const alert of alerts) {
      const product = alert.product_id;
      if (!product) {
        console.warn(`⚠️ Alert ${alert._id} has no product, skipping`);
        continue;
      }

      console.log(`\n📊 Checking alert for: ${product.title}`);
      console.log(`   Target Price: ₹${alert.target_price}`);
      console.log(`   Current Price (DB): ₹${product.currentPrice}`);
      console.log(`   Last scraped: ${product.lastScrapedAt || "Never"}`);

      // Use currentPrice from database instead of scraping
      // This is more reliable and faster
      let currentPrice = product.currentPrice;

      // Only scrape if price data is stale (older than 1 hour) or missing
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const isStale =
        !product.lastScrapedAt || product.lastScrapedAt < oneHourAgo;

      if (!currentPrice || isStale) {
        console.log(`   🔄 Price data is stale, scraping fresh data...`);
        const scrapedPrice = await scrapeCurrentPrice(
          product.url,
          product.site,
        );
        if (scrapedPrice !== null) {
          currentPrice = scrapedPrice;
          // Update product with new price
          product.currentPrice = currentPrice;
          product.lastScrapedAt = new Date();
          product.priceHistory.push({
            price: currentPrice,
            at: new Date(),
          });
          await product.save();
          console.log(`   ✅ Updated price to: ₹${currentPrice}`);
        } else {
          console.log(
            `   ⚠️ Scraping failed, using DB price: ₹${currentPrice || "N/A"}`,
          );
        }
      }

      if (currentPrice === null || currentPrice === undefined) {
        console.log(`   ⚠️ No price available, skipping alert`);
        continue;
      }

      // Check if price is at or below target
      if (currentPrice <= alert.target_price) {
        console.log(
          `\n🔥 ALERT TRIGGERED! ${product.title}\n   Current: ₹${currentPrice} | Target: ₹${alert.target_price}`,
        );

        // Update Alert
        alert.triggered_at = new Date();
        alert.is_active = false; // Disable after trigger to avoid spam
        await alert.save();

        // Send Email
        let recipient = null;

        // Try to get email - either from user_id directly (if it's an email) or fetch from User model
        if (alert.user_id.includes("@")) {
          recipient = alert.user_id;
        } else if (User) {
          try {
            const user = await User.findById(alert.user_id);
            if (user && user.email) {
              recipient = user.email;
            } else {
              console.warn(`⚠️ User not found for alert ID: ${alert._id}`);
            }
          } catch (userErr) {
            console.error(
              `❌ Error fetching user for alert ${alert._id}:`,
              userErr.message,
            );
          }
        } else {
          console.warn("⚠️ User model not provided to worker.");
        }

        if (recipient && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          console.log(`📧 Sending alert email to: ${recipient}`);
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: `🔥 Price Drop Alert: ${product.title}`,
            html: `
                <h2>Great News! Price Drop Detected</h2>
                <p><strong>${product.title}</strong> has dropped to your target price!</p>
                <p><strong>Current Price:</strong> ₹${currentPrice}</p>
                <p><strong>Your Target Price:</strong> ₹${alert.target_price}</p>
                <p><a href="${product.url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Product</a></p>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">This alert has been automatically disabled to prevent spam. You can create a new alert if needed.</p>
              `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("❌ Error sending email:", error.message);
            } else {
              console.log("✅ Email sent successfully:", info.response);
            }
          });
        } else if (!recipient) {
          console.warn("⚠️ No recipient email found for alert");
        } else {
          console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured in .env");
          console.log(
            `   EMAIL_USER: ${process.env.EMAIL_USER ? "Set" : "Missing"}`,
          );
          console.log(
            `   EMAIL_PASS: ${process.env.EMAIL_PASS ? "Set" : "Missing"}`,
          );
        }
      } else {
        console.log(
          `   ℹ️ Price ₹${currentPrice} is above target ₹${alert.target_price}, no alert sent`,
        );
      }
    }

    console.log("\n✅ Alert check completed\n");
  } catch (err) {
    console.error("❌ Error in checkAlerts:", err);
  }
}

module.exports = { checkAlerts };
