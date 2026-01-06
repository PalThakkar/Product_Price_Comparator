"use client";

import { isLoggedIn } from "../utils/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import PriceHistoryChart from "../components/PriceHistoryChart";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [checkingNow, setCheckingNow] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  // const [userId, setUserId] = useState("test123"); // Default test user

  // Form state
  const [newAlert, setNewAlert] = useState({
    product_id: "",
    target_price: "",
  });

  // Load alerts and products
  useEffect(() => {
    loadAlerts();
    loadProducts();
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
    }
  }, []);

  // async function loadAlerts() {
  //   try {
  //     const res = await axios.get(`${BACKEND_URL}/api/alerts`, {
  //       params: { user_id: userId }
  //     });
  //     setAlerts(res.data);
  //   } catch (err: any) {
  //     setError("Failed to load alerts");
  //   }
  // }

  async function loadAlerts() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view alerts");
        return;
      }

      const res = await axios.get(`${BACKEND_URL}/api/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlerts(res.data);
      setError("");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load alerts");
      }
    }
  }

  async function loadSampleProducts() {
    try {
      // Do a quick search to populate some products
      const res = await axios.get(`${BACKEND_URL}/api/products`, {
        params: { query: "phone" },
      });
      const products = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
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
      const products = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setProducts(products);

      // If no products exist, show helpful message
      if (products.length === 0) {
        setError(
          "No products found. Please search for products on the main page first, then come back to create alerts."
        );
      }
    } catch (err: any) {
      setError(
        "Failed to load products. Please search for products on the main page first."
      );
    }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // await axios.post(`${BACKEND_URL}/api/alerts`, {
      //   ...newAlert,
      //   target_price: parseFloat(newAlert.target_price)
      // });

      await axios.post(
        `${BACKEND_URL}/api/alerts`,
        {
          product_id: newAlert.product_id,
          target_price: parseFloat(newAlert.target_price),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewAlert({ product_id: "", target_price: "" });
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
      await axios.patch(
        `${BACKEND_URL}/api/alerts/${alertId}`,
        { is_active: isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadAlerts();
    } catch (err: any) {
      setError("Failed to update alert");
    }
  }

  async function checkAlertsNow() {
    setCheckingNow(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to check alerts");
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/alerts/check-now`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg(
        "✅ Alert check completed! Check your email if any price drops were detected."
      );
      setTimeout(() => setSuccessMsg(""), 5000);
      loadAlerts(); // Reload to see updated statuses
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to check alerts");
    } finally {
      setCheckingNow(false);
    }
  }

  async function exportAlertsCSV() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/alerts/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "price-alerts.csv");
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Failed to export CSV");
    }
  }

  async function exportAlertsPDF() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/alerts/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "price-alerts.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Failed to export PDF");
    }
  }

  async function exportPriceHistoryCSV(
    productId: string,
    productTitle: string
  ) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URL}/api/alerts/export/price-history/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `price-history-${productTitle.replace(/\s+/g, "-")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Failed to export price history");
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
          <p className="text-lg text-gray-600">Manage your price drop alerts</p>
        </div>

        {/* User ID Input */}
        {/* <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID:
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Create Alert Button */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create New Alert"}
          </button>
          <button
            onClick={checkAlertsNow}
            disabled={checkingNow}
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {checkingNow ? "Checking..." : "🔍 Check Alerts Now"}
          </button>
          <button
            onClick={exportAlertsCSV}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 Export CSV
          </button>
          <button
            onClick={exportAlertsPDF}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            📄 Export PDF
          </button>
          {products.length === 0 && (
            <button
              onClick={loadSampleProducts}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
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
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, product_id: e.target.value })
                  }
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
                {newAlert.product_id && (
                  <p className="text-xs text-gray-500 mb-2">
                    Current price: ₹
                    {
                      (
                        products.find(
                          (p: any) => p._id === newAlert.product_id
                        ) as any
                      )?.currentPrice
                    }
                    . Enter a lower price.
                  </p>
                )}
                <input
                  type="number"
                  step="0.01"
                  value={newAlert.target_price}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, target_price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target price (must be less than current)"
                  max={
                    newAlert.product_id
                      ? String(
                          (
                            products.find(
                              (p: any) => p._id === newAlert.product_id
                            ) as any
                          )?.currentPrice
                        )
                      : undefined
                  }
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
                <a
                  href="/"
                  className="text-blue-600 hover:underline font-medium"
                >
                  → Go to Main Page to Search Products
                </a>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{successMsg}</p>
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
                      <h3 className="font-semibold text-lg">
                        {alert.product_id?.title}
                      </h3>
                      <p className="text-gray-600">{alert.product_id?.site}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Current Price:</span> ₹
                          {alert.product_id?.currentPrice}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Target Price:</span> ₹
                          {alert.target_price}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs ${
                              alert.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {alert.is_active ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setExpandedAlert(
                            expandedAlert === alert._id ? null : alert._id
                          )
                        }
                        className="px-4 py-2 rounded font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {expandedAlert === alert._id ? "Hide" : "Show"} Chart
                      </button>
                      <button
                        onClick={() => toggleAlert(alert._id, !alert.is_active)}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          alert.is_active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {alert.is_active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>

                  {/* Price History Chart */}
                  {expandedAlert === alert._id &&
                    alert.product_id?.priceHistory && (
                      <div className="mt-6 pt-4 border-t">
                        {" "}
                        <div className="mb-4 flex gap-2">
                          <button
                            onClick={() =>
                              exportPriceHistoryCSV(
                                alert.product_id._id,
                                alert.product_id.title
                              )
                            }
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition-colors"
                          >
                            📊 Export Price History
                          </button>
                        </div>{" "}
                        <PriceHistoryChart
                          priceHistory={alert.product_id.priceHistory}
                          targetPrice={alert.target_price}
                          currentPrice={alert.product_id.currentPrice}
                          productTitle={alert.product_id.title}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
