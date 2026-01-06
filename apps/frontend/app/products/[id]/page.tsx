"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    if (productId) {
      loadProductData();
    }
  }, [productId]);

  async function loadProductData() {
    setLoading(true);
    setError("");

    try {
      // Load product details
      const productRes = await axios.get(`${BACKEND_URL}/api/products/${productId}`);
      setProduct(productRes.data);

      // Load price history
      const historyRes = await axios.get(`${BACKEND_URL}/api/products/${productId}/price-history`);
      setPriceHistory(historyRes.data.priceHistory);

      // Load suggested price
      const suggestedRes = await axios.get(`${BACKEND_URL}/api/products/${productId}/suggested-price`);
      setSuggestedPrice(suggestedRes.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load product data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600">{error || "Product not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className={`font-medium ${product.site === 'Amazon' ? 'text-orange-600' :
              product.site === 'Flipkart' ? 'text-blue-600' :
                product.site === 'Croma' ? 'text-green-600' :
                  product.site === 'Reliance' ? 'text-purple-600' :
                    'text-gray-500'
              }`}>{product.site}</span>
            <span>•</span>
            <a href={product.url} target="_blank" className="text-blue-600 hover:underline">
              View Product
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Price History
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === "suggestions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              Price Analysis
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Product Details Tab */}
          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{product.currentPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg">
                      {product.lastScrapedAt ? new Date(product.lastScrapedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Product URL</p>
                  <a href={product.url} target="_blank" className="text-blue-600 hover:underline break-all">
                    {product.url}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Price History Tab */}
          {activeTab === "history" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Price History</h2>
              {priceHistory.length === 0 ? (
                <p className="text-gray-500">No price history available</p>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={priceHistory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="at"
                        tickFormatter={(date: any) => new Date(date).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date: any) => new Date(date).toLocaleString()}
                        formatter={(value: any) => [`₹${value?.toLocaleString()}`, "Price"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Detailed History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {priceHistory.map((history: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(history.at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{history.price?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Price Analysis Tab */}
          {activeTab === "suggestions" && suggestedPrice && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Price Analysis & Suggestions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Current Price</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{suggestedPrice.currentPrice?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h3 className="font-semibold mb-2">Suggested Price</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{suggestedPrice.suggestedPrice?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-gray-600">Min Price</p>
                    <p className="font-bold">₹{suggestedPrice.statistics?.minPrice?.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-gray-600">Average Price</p>
                    <p className="font-bold">₹{suggestedPrice.statistics?.avgPrice?.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-sm text-gray-600">Max Price</p>
                    <p className="font-bold">₹{suggestedPrice.statistics?.maxPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-2">Analysis</h3>
                <p className="text-gray-700 mb-2">{suggestedPrice.reasoning}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Confidence:</span>
                  <span className={`px-2 py-1 rounded text-xs ${suggestedPrice.confidence === 'high' ? 'bg-green-100 text-green-800' :
                    suggestedPrice.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {suggestedPrice.confidence}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
