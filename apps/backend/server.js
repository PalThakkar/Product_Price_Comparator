// apps/backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
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

// simple product model
const productSchema = new mongoose.Schema({
  title: String,
  url: { type: String, unique: true, required: true },
  site: String,
  currentPrice: Number,
  priceHistory: [{ price: Number, at: Date }],
  lastScrapedAt: Date
});
const Product = mongoose.model('Product', productSchema);

// GET /api/products - list
app.get('/api/products', async (req, res) => {
  try {
    const items = await Product.find().limit(50).lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/products - add sample
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

const { scrapeProduct } = require('../../packages/scraper/scrapeAmazon');

app.post('/api/scrape', async (req, res) => {
  const { url, site } = req.body;
  if (!url) return res.status(400).send('url required');
  try {
    const data = await scrapeProduct(url);
    // save or update product in DB (example)
    let prod = await Product.findOne({ url });
    if (!prod) {
      prod = new Product({
        title: data.title,
        url,
        site: site || 'unknown',
        currentPrice: data.price,
        priceHistory: data.price ? [{ price: data.price, at: new Date() }] : [],
        lastScrapedAt: new Date()
      });
    } else {
      if (data.price != null && data.price !== prod.currentPrice) {
        prod.priceHistory.push({ price: data.price, at: new Date() });
        prod.currentPrice = data.price;
      }
      prod.lastScrapedAt = new Date();
    }
    await prod.save();
    res.json(prod);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message || 'Scrape error');
  }
});

async function start() {
  try {
    // no useNewUrlParser/useUnifiedTopology options here
    await mongoose.connect(MONGO);
    app.listen(PORT, () => console.log(`Server running ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received, closing mongoose connection');
  await mongoose.disconnect();
  process.exit(0);
});
