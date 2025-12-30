// // apps/backend/server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const morgan = require('morgan');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// const PORT = process.env.PORT || 4000;
// const MONGO = process.env.MONGO_URI;

// if (!MONGO) {
//   console.error('MONGO_URI is not set in .env');
//   process.exit(1);
// }

// mongoose.connection.on('connected', () => console.log('Mongoose connected'));
// mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
// mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// // simple product model
// const productSchema = new mongoose.Schema({
//   title: String,
//   url: { type: String, unique: true, required: true },
//   site: String,
//   currentPrice: Number,
//   priceHistory: [{ price: Number, at: Date }],
//   lastScrapedAt: Date
// });
// const Product = mongoose.model('Product', productSchema);

// // GET /api/products - list
// // app.get('/api/products', async (req, res) => {
// //   try {
// //     const items = await Product.find().limit(50).lean();
// //     res.json(items);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Server error');
// //   }
// // });
// // GET /api/products?query=iphone  (Amazon scrape + sample save)
// app.get('/api/products', async (req, res) => {
//   try {
//     const query = String(req.query.query || '').trim();

//     // Agar query na ho to DB se existing list dikhao (UI ke liye helpful)
//     if (!query) {
//       const items = await Product.find().sort({ updatedAt: -1 }).limit(50).lean();
//       return res.json(items);
//     }

//     // Amazon se scrape karo
//     const results = await scrapeAmazonSearch(query, 8);

//     // First 3 ko DB me sample ke tor par upsert
//     const now = new Date();
//     for (const r of results.slice(0, 3)) {
//       await Product.updateOne(
//         { url: r.productUrl },
//         {
//           $setOnInsert: {
//             title: r.title,
//             site: r.site,
//             url: r.productUrl
//           },
//           $set: {
//             currentPrice: r.price,
//             lastScrapedAt: now
//           },
//           $push: r.price != null ? { priceHistory: { price: r.price, at: now } } : {}
//         },
//         { upsert: true }
//       );
//     }

//     // Frontend ko normalized list bhejo (price ascending)
//     const sorted = results
//       .filter((r) => r.price != null)
//       .sort((a, b) => a.price - b.price);

//     res.json({ query, results: sorted });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to fetch products');
//   }
// });


// // POST /api/products - add sample
// app.post('/api/products', async (req, res) => {
//   try {
//     const p = new Product(req.body);
//     await p.save();
//     res.status(201).json(p);
//   } catch (err) {
//     console.error(err);
//     res.status(400).send(err.message);
//   }
// });

// // const { scrapeProduct } = require('../../packages/scraper/scrapeAmazon');
// const { scrapeAmazonSearch } = require('../../packages/scrapers/amazon');

// app.post('/api/scrape', async (req, res) => {
//   const { url, site } = req.body;
//   if (!url) return res.status(400).send('url required');
//   try {
//     const data = await scrapeProduct(url);
//     // save or update product in DB (example)
//     let prod = await Product.findOne({ url });
//     if (!prod) {
//       prod = new Product({
//         title: data.title,
//         url,
//         site: site || 'unknown',
//         currentPrice: data.price,
//         priceHistory: data.price ? [{ price: data.price, at: new Date() }] : [],
//         lastScrapedAt: new Date()
//       });
//     } else {
//       if (data.price != null && data.price !== prod.currentPrice) {
//         prod.priceHistory.push({ price: data.price, at: new Date() });
//         prod.currentPrice = data.price;
//       }
//       prod.lastScrapedAt = new Date();
//     }
//     await prod.save();
//     res.json(prod);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e.message || 'Scrape error');
//   }
// });

// async function start() {
//   try {
//     // no useNewUrlParser/useUnifiedTopology options here
//     await mongoose.connect(MONGO);
//     app.listen(PORT, () => console.log(`Server running ${PORT}`));
//   } catch (err) {
//     console.error('Failed to connect to MongoDB:', err);
//     process.exit(1);
//   }
// }

// start();

// // graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('SIGINT received, closing mongoose connection');
//   await mongoose.disconnect();
//   process.exit(0);
// });
/************************************************************************************************************************ */

// apps/backend/server.js
console.log("🔥🔥🔥 BACKEND BOOTED 🔥🔥🔥");


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { scrapeAmazonSearch } = require('../../packages/scrapers/amazon');
const { scrapeFlipkartSearch } = require("../../packages/scrapers/flipkart");
const { scrapeCromaSearch } = require("../../packages/scrapers/cromaApi");
const { scrapeRelianceSearch } = require("../../packages/scrapers/relianceApi");

const app = express();

app.use(cors({ 
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ] 
}));
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

const productSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, unique: true, required: true },
    site: String,
    currentPrice: Number,
    priceHistory: [{ price: Number, at: Date }],
    lastScrapedAt: Date,
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);

const alertSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    target_price: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
    triggered_at: Date,
  },
  { timestamps: true }
);
const Alert = mongoose.model('Alert', alertSchema);

// GET /api/products?query=iphone[&debug=1]
app.get('/api/products', async (req, res) => {
  console.log("🔥🔥🔥 /api/compare ROUTE HIT 🔥🔥🔥");

  try {
    const query = String(req.query.query || '').trim();
    const debug = req.query.debug === '1';
    console.log('>>> HIT /api/products | query =', query || '(none)', '| debug =', debug);

    if (!query) {
      const items = await Product.find().sort({ updatedAt: -1 }).limit(50).lean();
      return res.json({ source: 'express-backend', mode: 'no-query', results: items });
    }

    const results = await scrapeAmazonSearch(query, 8, { debug });
    console.log('>>> /api/products extracted count =', results.length);

    // upsert few samples
    const now = new Date();
    for (const r of results.slice(0, 3)) {
      await Product.updateOne(
        { url: r.productUrl },
        {
          $setOnInsert: { title: r.title, site: r.site, url: r.productUrl },
          $set: { currentPrice: r.price, lastScrapedAt: now },
          ...(r.price != null ? { $push: { priceHistory: { price: r.price, at: now } } } : {}),
        },
        { upsert: true }
      );
    }

    const sorted = results.filter(r => r.price != null).sort((a, b) => a.price - b.price);
    res.json({ source: 'express-backend', mode: debug ? 'debug' : 'normal', query, results: sorted });
  } catch (err) {
    console.error('>>> /api/products ERROR:', err.stack || err);
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

// GET /api/compare?query=iphone
app.get("/api/compare", async (req, res) => {
  const query = String(req.query.query || "").trim();
  if (!query) return res.status(400).json({ error: "query required" });

  console.log("\n==============================");
  console.log("COMPARE query:", query);

  let amazon = [];
  let flipkart = [];
  let croma = [];
  let reliance = [];

  try {
    console.log("▶️ Calling Amazon...");
    amazon = await scrapeAmazonSearch(query, 8);
    console.log("✅ Amazon:", amazon.length);
  } catch (e) {
    console.error("❌ Amazon failed:", e.message);
  }

  try {
    console.log("▶️ Calling Flipkart...");
    flipkart = await scrapeFlipkartSearch(query, 8);
    console.log("✅ Flipkart:", flipkart.length);
  } catch (e) {
    console.error("❌ Flipkart failed:", e.message);
  }

  try {
    console.log("▶️ Calling Croma...");
    croma = await scrapeCromaSearch(query, 8);
    console.log("✅ Croma:", croma.length);
  } catch (e) {
    console.error("❌ Croma failed:", e.message);
  }

  try {
    console.log("▶️ Calling Reliance...");
    reliance = await scrapeRelianceSearch(query, 8);
    console.log("✅ Reliance:", reliance.length);
  } catch (e) {
    console.error("❌ Reliance failed:", e.message);
  }

  const combined = [...amazon, ...flipkart, ...croma, ...reliance].sort((a, b) => {
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return a.price - b.price;
  });

  console.log("📦 TOTAL RESULTS:", combined.length);
  console.log("==============================\n");

  res.json({
    query,
    amazon: amazon.length,
    flipkart: flipkart.length,
    croma: croma.length,
    reliance: reliance.length,
    results: combined,
  });
});

// ALERT APIs

// POST /api/alerts - Create new alert
app.post('/api/alerts', async (req, res) => {
  try {
    const { user_id, product_id, target_price } = req.body;
    
    if (!user_id || !product_id || !target_price) {
      return res.status(400).json({ error: 'user_id, product_id, and target_price are required' });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const alert = new Alert({
      user_id,
      product_id,
      target_price,
      is_active: true
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alerts - Get user's alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const alerts = await Alert.find({ user_id })
      .populate('product_id', 'title url currentPrice site')
      .sort({ createdAt: -1 });
    
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/alerts/:id - Update alert (disable/update)
app.patch('/api/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const alert = await Alert.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('product_id', 'title url currentPrice site');
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PRODUCT DETAIL APIs

// GET /api/products/:id - Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id/price-history - Get product price history
app.get('/api/products/:id/price-history', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, 'priceHistory title url currentPrice');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      product: {
        id: product._id,
        title: product.title,
        url: product.url,
        currentPrice: product.currentPrice
      },
      priceHistory: product.priceHistory.sort((a, b) => new Date(b.at) - new Date(a.at))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id/suggested-price - Get suggested price based on history
app.get('/api/products/:id/suggested-price', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, 'priceHistory currentPrice');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { priceHistory, currentPrice } = product;
    
    if (!priceHistory || priceHistory.length === 0) {
      return res.json({
        suggestedPrice: currentPrice,
        reasoning: 'No price history available',
        confidence: 'low'
      });
    }

    const prices = priceHistory.map(h => h.price).filter(p => p != null);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    let suggestedPrice = currentPrice;
    let reasoning = '';
    let confidence = 'medium';

    if (currentPrice > avgPrice * 1.1) {
      suggestedPrice = avgPrice * 0.95;
      reasoning = `Current price (${currentPrice}) is above historical average (${avgPrice.toFixed(2)}). Suggested price is near average.`;
      confidence = 'high';
    } else if (currentPrice < minPrice * 1.05) {
      suggestedPrice = currentPrice;
      reasoning = `Current price (${currentPrice}) is near historical minimum (${minPrice}). Good time to buy!`;
      confidence = 'high';
    } else {
      suggestedPrice = avgPrice;
      reasoning = `Current price (${currentPrice}) is within normal range. Historical average: ${avgPrice.toFixed(2)}, Min: ${minPrice}, Max: ${maxPrice}`;
      confidence = 'medium';
    }

    res.json({
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      currentPrice,
      statistics: {
        minPrice,
        maxPrice,
        avgPrice: Math.round(avgPrice * 100) / 100,
        dataPoints: prices.length
      },
      reasoning,
      confidence
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Manual insert (testing)
app.post('/api/products', async (req, res) => {
  try {
    const p = new Product(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO);
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}
start();

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing mongoose connection');
  await mongoose.disconnect();
  process.exit(0);
});
