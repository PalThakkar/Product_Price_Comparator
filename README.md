# 🛒 Product Price Comparator

A full-stack web application that allows users to **search, compare, and track product prices** across multiple e-commerce platforms like **Amazon, Flipkart, Croma, and Reliance**.  
Users can also create **price drop alerts** and receive notifications when prices fall below their desired value.

---

## 🚀 Features

### 🔍 Product Search & Comparison
- Search products across multiple platforms
- Compare prices in real time
- Sort results by lowest price
- View product images, titles, prices, and links

### 📉 Price Tracking
- Automatically stores product price history
- Maintains current price and last updated time
- Price trend analysis & suggested buying price

### 🔔 Price Alerts
- Create alerts for desired target prices
- Enable / disable alerts anytime
- Alerts are linked to authenticated users
- (Email notifications ready for integration)

### 🔐 Authentication
- User signup & login 
- Protected routes (alerts, products)
- Secure API access with token-based auth

### ⚡ Performance Optimizations
- Redis caching for search results
- Parallel scraping for faster responses
- Cron-ready architecture for scheduled updates

---

## 🏗 Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- **React**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Puppeteer (Scraping)**

### Infrastructure & Tools
- **Redis** (Caching)
- **Nodemon**
- **dotenv**
- **Morgan**
- **Cron Jobs**

---



