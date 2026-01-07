"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeaturesPage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const features = [
    {
      id: "search",
      icon: "🔍",
      title: "Multi-Site Search",
      description: "Search products across 4 retailers instantly",
      details:
        "Scrapes Amazon, Flipkart, Croma, and Reliance Digital in parallel. Results sorted by lowest price.",
      status: "✅ Active",
    },
    {
      id: "filters",
      icon: "🎯",
      title: "Advanced Filters",
      description: "Filter by price range and retailer",
      details:
        "Real-time filtering with min/max price sliders and retailer checkboxes. See filtered count instantly.",
      status: "✅ Active",
    },
    {
      id: "alerts",
      icon: "🔔",
      title: "Price Alerts",
      description: "Get notified when prices drop",
      details:
        "Set target prices for any product. Get email alerts when prices fall below your target. Checks every 30 minutes.",
      status: "✅ Active",
    },
    {
      id: "suggestion",
      icon: "💡",
      title: "Smart Price Suggestions",
      description: "AI-powered price recommendations",
      details:
        "Analyzes price history and suggests ideal target prices. Shows min/max/avg prices and potential savings %.",
      status: "✅ New",
    },
    {
      id: "history",
      icon: "📈",
      title: "Price History Charts",
      description: "Visualize price trends over time",
      details:
        "Interactive charts showing historical prices with timestamps. Helps identify best buying times.",
      status: "✅ Active",
    },
    {
      id: "export",
      icon: "📊",
      title: "Export Features",
      description: "Download data in CSV & PDF",
      details:
        "Export comparison results as CSV or formatted PDF reports. Perfect for sharing with friends.",
      status: "✅ Active",
    },
    {
      id: "auth",
      icon: "🔐",
      title: "Secure Authentication",
      description: "JWT-based login with encryption",
      details:
        "Sign up and login securely. Passwords encrypted with bcrypt. JWT tokens for session management.",
      status: "✅ Active",
    },
    {
      id: "caching",
      icon: "⚡",
      title: "Redis Caching",
      description: "10x faster repeated searches",
      details:
        "Caches search results for 30 minutes. First search: 5-10s, cached searches: <500ms.",
      status: "✅ New",
    },
    {
      id: "errors",
      icon: "🛡️",
      title: "Error Handling",
      description: "Graceful error management",
      details:
        "Centralized error handling with detailed logging. Graceful fallbacks for all error scenarios.",
      status: "✅ New",
    },
    {
      id: "logging",
      icon: "📝",
      title: "Logging System",
      description: "Complete system observability",
      details:
        "Color-coded logs with timestamps. Persistent file logging. Easy debugging and monitoring.",
      status: "✅ New",
    },
    {
      id: "seo",
      icon: "🔗",
      title: "SEO Optimization",
      description: "Search engine friendly",
      details:
        "Meta tags, Open Graph, and JSON-LD structured data. Improves search rankings and social sharing.",
      status: "✅ New",
    },
    {
      id: "tests",
      icon: "🧪",
      title: "Automated Tests",
      description: "Jest test suite ready",
      details:
        "Unit tests for models, validation, and business logic. Ready for CI/CD pipeline integration.",
      status: "✅ New",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Product Price Comparator
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Complete Feature Showcase - All 12 Features Implemented
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔍 Go to Search
            </Link>
            <Link
              href="/alerts"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔔 View Alerts
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔐 Login
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">12</p>
            <p className="text-white/80">Features</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-green-400">4</p>
            <p className="text-white/80">Retailers</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">✅</p>
            <p className="text-white/80">Production Ready</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-yellow-400">⚡</p>
            <p className="text-white/80">10x Faster</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:border-white/40 transition-all hover:shadow-xl cursor-pointer overflow-hidden"
              onClick={() =>
                setExpandedFeature(
                  expandedFeature === feature.id ? null : feature.id
                )
              }
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{feature.icon}</span>
                  <span className="text-xs font-bold text-green-400">
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-blue-200 text-sm mb-4">
                  {feature.description}
                </p>

                {expandedFeature === feature.id && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/80 text-sm leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                )}

                <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 mt-4">
                  {expandedFeature === feature.id ? "Collapse" : "Learn More"} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Stack */}
        <div className="mt-16 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🛠️ Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-4">
                Frontend
              </h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Next.js 14 (React)</li>
                <li>✓ TypeScript</li>
                <li>✓ Tailwind CSS</li>
                <li>✓ Recharts (Price charts)</li>
                <li>✓ Axios (API calls)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-4">
                Backend
              </h3>
              <ul className="space-y-2 text-white/80">
                <li>✓ Node.js + Express</li>
                <li>✓ MongoDB Atlas</li>
                <li>✓ Redis (Caching)</li>
                <li>✓ Puppeteer (Scraping)</li>
                <li>✓ Node-cron (Scheduling)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur border border-blue-400/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 Performance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/80 mb-2">Fresh Search</p>
              <p className="text-3xl font-bold text-blue-300">5-10s</p>
              <p className="text-sm text-white/60">Multi-site scraping in parallel</p>
            </div>
            <div>
              <p className="text-white/80 mb-2">Cached Search</p>
              <p className="text-3xl font-bold text-green-300">&lt;500ms</p>
              <p className="text-sm text-white/60">30-minute Redis cache</p>
            </div>
            <div>
              <p className="text-white/80 mb-2">Alert Check</p>
              <p className="text-3xl font-bold text-yellow-300">Every 30min</p>
              <p className="text-sm text-white/60">Automated cron job</p>
            </div>
            <div>
              <p className="text-white/80 mb-2">Database Query</p>
              <p className="text-3xl font-bold text-purple-300">&lt;50ms</p>
              <p className="text-sm text-white/60">With indexes optimized</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Shopping Smarter?
          </h2>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Go to Price Comparator
          </Link>
        </div>
      </div>
    </div>
  );
}
