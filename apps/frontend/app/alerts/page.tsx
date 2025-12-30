"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const [userId, setUserId] = useState("test123"); // Default test user

  // Form state
  const [newAlert, setNewAlert] = useState({
    user_id: userId,
    product_id: "",
    target_price: ""
  });

  // Load alerts and products
  useEffect(() => {
    loadAlerts();
    loadProducts();
  }, []);

  async function loadAlerts() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/alerts`, {
        params: { user_id: userId }
      });
      setAlerts(res.data);
    } catch (err: any) {
      setError("Failed to load alerts");
    }
  }

  async function loadSampleProducts() {
    try {
      // Do a quick search to populate some products
      const res = await axios.get(`${BACKEND_URL}/api/products`, {
        params: { query: "phone" }
      });
      const products = res.data.results || [];
      setProducts(products);
      if (products.length > 0) {
        setError("");
      }
    } catch (err: any) {
      setError("Failed to load sample products");
    }
  }

  async function loadProducts() {
    try {
      // Load existing products from database (no query to get saved products)
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      const products = res.data.results || [];
      setProducts(products);
      
      // If no products exist, show helpful message
      if (products.length === 0) {
        setError("No products found. Please search for products on the main page first, then come back to create alerts.");
      }
    } catch (err: any) {
      setError("Failed to load products. Please search for products on the main page first.");
    }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${BACKEND_URL}/api/alerts`, {
        ...newAlert,
        target_price: parseFloat(newAlert.target_price)
      });
      
      setNewAlert({ user_id: userId, product_id: "", target_price: "" });
      setShowCreateForm(false);
      loadAlerts();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create alert");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAlert(alertId: string, isActive: boolean) {
    try {
      await axios.patch(`${BACKEND_URL}/api/alerts/${alertId}`, {
        is_active: isActive
      });
      loadAlerts();
    } catch (err: any) {
      setError("Failed to update alert");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Price Alerts
          </h1>
          <p className="text-lg text-gray-600">
            Manage your price drop alerts
          </p>
        </div>

        {/* User ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID:
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Create Alert Button */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create New Alert"}
          </button>
          {products.length === 0 && (
            <button
              onClick={loadSampleProducts}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load Sample Products
            </button>
          )}
        </div>

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Create New Alert</h3>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product:
                </label>
                <select
                  value={newAlert.product_id}
                  onChange={(e) => setNewAlert({...newAlert, product_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product: any) => (
                    <option key={product._id} value={product._id}>
                      {product.title} - ₹{product.currentPrice}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (₹):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlert.target_price}
                  onChange={(e) => setNewAlert({...newAlert, target_price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target price"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Alert"}
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 mb-2">{error}</p>
            {error.includes("search for products") && (
              <div className="mt-3">
                <a href="/" className="text-blue-600 hover:underline font-medium">
                  → Go to Main Page to Search Products
                </a>
              </div>
            )}
          </div>
        )}

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Alerts ({alerts.length})
          </h2>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No alerts found. Create your first alert!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <div key={alert._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{alert.product_id?.title}</h3>
                      <p className="text-gray-600">{alert.product_id?.site}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Current Price:</span> ₹{alert.product_id?.currentPrice}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Target Price:</span> ₹{alert.target_price}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAlert(alert._id, !alert.is_active)}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          alert.is_active 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {alert.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
