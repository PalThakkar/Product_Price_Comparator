# Quick Start Guide - Product Price Comparator

## 🚀 Getting Started in 5 Minutes

### Prerequisites

- Node.js 16+ installed
- MongoDB database running (or MongoDB Atlas account)
- Gmail account with App Password enabled

### Step 1: Setup Environment Variables

Create `.env` file in `/apps/backend/`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/product-comparator
JWT_SECRET=your-secret-key-change-this
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 2: Install Dependencies

**Backend:**

```bash
cd apps/backend
npm install
```

**Frontend:**

```bash
cd apps/frontend
npm install
```

### Step 3: Start the Servers

**Terminal 1 - Backend (Port 4000):**

```bash
cd apps/backend
npm start
```

Expected output:

```
🚀 Backend server running on port 4000
✅ MongoDB Connected
⏰ Price alert checker scheduled (every 30 minutes)
```

**Terminal 2 - Frontend (Port 3001):**

```bash
cd apps/frontend
npm run dev
```

Expected output:

```
✓ Ready in X.Xs
✓ Starting...
✓ Compiled / in X.Xs
```

### Step 4: Open Application

Visit: **http://localhost:3001**

---

## 📖 Usage Workflow

### 1. Search for Products

```
1. Go to home page (/)
2. Enter product name in search box
3. Click "Search" or press Enter
4. Browse results from Amazon, Flipkart, Croma
```

### 2. Create Price Alert

```
1. Click "🔔 Set Price Alert" on any product
2. If not logged in, sign up or login
3. Enter your target price (must be less than current)
4. Click "Create Alert"
5. Confirmation message appears
```

### 3. Manage Alerts

```
1. Go to /alerts page
2. View all your active alerts
3. Click "Show Chart" to see price history
4. Toggle alerts on/off
5. Delete alerts you no longer need
```

### 4. Monitor Price History

```
1. Open an alert from /alerts page
2. Click "Show Chart" button
3. See:
   - Price trend over time
   - Current vs Target price
   - Lowest price recorded
   - Potential savings
   - Best deal information
```

---

## 🔑 Features Overview

### Home Page (/)

- **Search Box**: Find products across 3 retailers
- **Results**: Shows lowest prices from each site
- **Alert Button**: Set price target for any product
- **Login/Signup**: Access your alerts

### Alerts Dashboard (/alerts)

- **View Alerts**: See all your active alerts
- **Create Alert**: Add new price targets
- **Price Chart**: Visualize price history and trends
- **Enable/Disable**: Toggle alerts on/off
- **Manual Check**: Trigger alert check immediately

### Price History Chart

- **Line Chart**: Shows last 30 price points
- **Statistics**: Current, target, lowest, savings
- **Trends**: Visualize price movement
- **Insights**: Best deal date, average price
- **Target Line**: Reference line showing your target

---

## 📊 How Alerts Work

### Creation

```
User sets target price
        ↓
Alert saved to database
        ↓
Linked to product and user
```

### Checking (Every 30 Minutes)

```
Cron job starts
        ↓
Scrapes current prices
        ↓
Compares with target prices
        ↓
If price ≤ target:
  - Send email to user
  - Disable alert (prevent spam)
  - Record triggered time
```

### Notification

```
Email received with:
- Product details
- Current price
- Direct purchase link
- Your target price
```

---

## 🔒 Authentication

### Sign Up

```
1. Click "Sign Up" on login page
2. Enter email and password
3. Account created in MongoDB
4. Automatically logged in
```

### Login

```
1. Click "Login" on home page
2. Enter email and password
3. JWT token stored in localStorage
4. Token sent with each request
```

### Logout

```
1. Click "Logout" (if visible)
2. localStorage cleared
3. Redirected to home page
```

---

## 🛠️ Troubleshooting

### Backend Won't Start

```bash
# Check MongoDB connection
# Verify MONGO_URI in .env

# Check port 4000 is available
netstat -ano | findstr :4000

# Clear npm cache and reinstall
npm cache clean --force
npm install
```

### Frontend Shows Blank Page

```bash
# Check if backend is running
curl http://localhost:4000/api/products

# Clear browser cache
# Ctrl+Shift+Delete (Clear Browsing Data)

# Check browser console for errors
F12 → Console tab
```

### Alerts Not Triggering

```bash
1. Check backend logs for cron message
2. Verify MongoDB connection
3. Ensure alert target < current price
4. Check email credentials
5. Wait up to 30 minutes for next check
   (or click "Check Alerts Now" button)
```

### Email Not Sending

```bash
1. Verify GMAIL_USER in .env
2. Use Gmail App Password (not regular password)
3. Enable "Less secure apps" in Gmail
4. Check spam folder
5. Verify email address is correct
```

### Chart Not Showing

```bash
1. Ensure product has price history
2. Wait for first cron run (30 min or click manual check)
3. Price history updates each time cron checks
4. Chart needs at least 2 data points
```

---

## 🔍 Testing the System

### Quick Test

```
1. Search for "washing machine"
2. Find cheapest option
3. Set alert for ₹500 below current price
4. Click "Check Alerts Now" button
5. Check email for notification
6. View chart on alerts page
```

### Verify Cron Job

```bash
1. Check backend logs
2. Look for:
   "⏰ Price alert checker scheduled"
   "Found X active alerts"
   "Successfully scraped prices for X products"
```

### Test Email

```bash
1. Create alert with low target price
2. Click "Check Alerts Now"
3. Check email inbox
4. Look for HTML-formatted email
5. Click product link in email
```

---

## 📱 Mobile Usage

### Responsive Design

- ✅ Works on phones (320px+)
- ✅ Works on tablets
- ✅ Touch-friendly buttons
- ✅ Readable text on all sizes

### Recommended

- Use landscape on phone for charts
- Use tablet for full experience
- Desktop for best visualization

---

## 🚀 Deployment

### Quick Deploy (Vercel + Railway)

**Frontend (Vercel):**

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts
```

**Backend (Railway/Heroku):**

```bash
# Push to GitHub
git push

# Connect GitHub repo to Railway
# Set environment variables
# Deploy
```

---

## 📞 API Testing

### Quick API Test

```bash
# Get all products
curl http://localhost:4000/api/products

# Search products
curl "http://localhost:4000/api/search?q=phone"

# Create test user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'
```

---

## ⚙️ Configuration

### Change Alert Frequency

Edit `/apps/backend/server.js`:

```javascript
// Change cron schedule
cron.schedule("*/15 * * * *", async () => {
  // Every 15 minutes
  // Check alerts...
});
```

### Add More Retailers

1. Create scraper in `/packages/scrapers/newretailer.js`
2. Add to search routes
3. Test scraper
4. Update documentation

### Customize Email Template

Edit `/apps/backend/utils/alertWorker.js`:

- Modify HTML template
- Change sender name
- Add custom branding

---

## 📊 Database Backup

### MongoDB Atlas

```
1. Go to mongodb.com/cloud
2. Login to your cluster
3. Go to Backup
4. Create manual backup
5. Download when complete
```

### Local Backup

```bash
# Export data
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore data
mongorestore ./backup
```

---

## 🎓 Learning Resources

### System Architecture

- See `/IMPLEMENTATION_SUMMARY.md` for detailed architecture
- See `/FEATURE_COMPLETION_REPORT.md` for feature details
- See code comments in files

### Tech Stack Docs

- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Next.js: https://nextjs.org/docs
- Recharts: https://recharts.org

---

## ✨ Tips & Tricks

### Best Practices

```
1. Set realistic target prices (5-20% below current)
2. Monitor 3-5 products for best experience
3. Check email spam folder for alerts
4. Use "Check Alerts Now" for immediate checks
5. View price charts weekly for trends
```

### Performance Tips

```
1. Close charts when not needed
2. Limit to 10-15 active alerts
3. Use "Disable" instead of "Delete" to keep history
4. Clear browser cache if slow
5. Restart servers weekly
```

---

## 🎉 You're Ready!

Your Product Price Comparator is now running. Start searching for products and setting up price alerts!

**Questions?** Check the code comments or review the implementation summary.

**Issues?** Follow the troubleshooting section above.

**Ready to deploy?** Check deployment options in IMPLEMENTATION_SUMMARY.md

---

**Happy Price Comparing! 🛍️📉💰**

For more details, see:

- `IMPLEMENTATION_SUMMARY.md` - Full architecture
- `FEATURE_COMPLETION_REPORT.md` - Feature checklist
- `README.md` - Original project docs
