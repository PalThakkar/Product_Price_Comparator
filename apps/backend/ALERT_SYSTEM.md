# Price Alert System

## ✅ Implementation Status

All requirements are now fully implemented:

### 1. ✅ Cron Job Worker (Every 30 Minutes)

- **File**: `server.js` (Line 212)
- **Schedule**: `*/30 * * * *` (Every 30 minutes)
- **Status**: Active when MongoDB connection is established

### 2. ✅ Automatic Price Scraping & Comparison

- **File**: `utils/alertWorker.js`
- **Function**: `checkAlerts()`
- **Process**:
  - Fetches all active alerts from database
  - Scrapes current prices from product URLs
  - Compares with user's target price
  - Triggers alert if current price ≤ target price

### 3. ✅ Email Notification System

- **Email Service**: Gmail (via nodemailer)
- **Features**:
  - HTML formatted emails
  - Product details and links
  - Auto-disable alerts after trigger (prevents spam)
  - User email lookup from database

---

## 📧 Email Setup Instructions

### Step 1: Configure Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Factor Authentication (if not already enabled)
3. Generate App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Price Comparator"
   - Copy the 16-character password

### Step 2: Update .env File

Edit `apps/backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
```

⚠️ **Important**: Use the App Password, NOT your regular Gmail password!

---

## 🧪 Testing the Alert System

### Option 1: Manual Test (Immediate)

Create a test script to trigger the worker immediately:

```javascript
// test-alert.js
require("dotenv").config();
const mongoose = require("mongoose");
const { checkAlerts } = require("./utils/alertWorker");

const Alert = require("./models/Alert"); // Create if missing
const Product = require("./models/Product");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");
    await checkAlerts(Alert, Product, User);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
```

Run: `node test-alert.js`

### Option 2: Change Cron Schedule (For Testing)

Temporarily change the schedule in `server.js`:

```javascript
// Test every 1 minute instead of 30
cron.schedule("*/1 * * * *", async () => {
  console.log("Running scheduled price check...");
  await checkAlerts(Alert, Product, User);
});
```

### Option 3: Check Logs

Monitor the console output for:

- `⏰ Running checkAlerts job...`
- `Found X active alerts.`
- `🔥 Alert Triggered!` (when price drops)
- `✅ Email sent successfully`

---

## 📊 Alert Schema

The Alert model has the following structure:

```javascript
{
  user_id: String,          // User's MongoDB ObjectId
  product_id: ObjectId,     // Reference to Product
  target_price: Number,     // Desired price threshold
  is_active: Boolean,       // false after trigger
  triggered_at: Date,       // When alert was triggered
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

---

## 🔄 How It Works

```
Every 30 minutes:
  ↓
1. Fetch all active alerts (is_active: true)
  ↓
2. For each alert:
   ├─ Get associated product details
   ├─ Scrape current price from product URL
   ├─ Compare: currentPrice ≤ targetPrice ?
   │   ├─ YES → Trigger Alert
   │   │   ├─ Fetch user email from User model
   │   │   ├─ Send email notification
   │   │   ├─ Mark alert as triggered (is_active: false)
   │   │   └─ Log trigger event
   │   └─ NO → Log "Price above target"
  ↓
3. Complete job and wait for next schedule
```

---

## 🛠️ Troubleshooting

### Cron Not Running?

- Check MongoDB connection status
- Verify server is running continuously (not restarting)
- Look for "Running scheduled price check..." in logs

### Emails Not Sending?

- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Check if you're using Gmail App Password (not regular password)
- Look for error messages in console
- Test with: `transporter.verify()` in alertWorker.js

### Price Not Updating?

- Check if scraper selectors are correct for the website
- Verify product URL is accessible
- Check browser console for scraping errors
- Review `scraper_artifacts/*.html` for debug info

---

## 📝 Next Steps

1. **Set up email credentials** in `.env`
2. **Create Alert API endpoints** (if not exists):
   - `POST /api/alerts` - Create alert
   - `GET /api/alerts` - List user alerts
   - `DELETE /api/alerts/:id` - Remove alert
3. **Test the system** with a manual trigger
4. **Monitor logs** for first scheduled run

---

## 🎯 Summary

| Requirement          | Status      | Details                                    |
| -------------------- | ----------- | ------------------------------------------ |
| Cron Job (30-60 min) | ✅ Complete | Running every 30 minutes                   |
| Auto Price Scraping  | ✅ Complete | Supports Amazon, Flipkart, Croma, Reliance |
| Price Comparison     | ✅ Complete | Triggers when price ≤ target               |
| Email Notification   | ✅ Complete | HTML emails via Gmail                      |

**All requirements are implemented!** Just configure email credentials to make it fully operational.
