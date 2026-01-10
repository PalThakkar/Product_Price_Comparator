"use client";

import { isLoggedIn } from "../utils/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import PriceHistoryChart from "../components/PriceHistoryChart";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [checkingNow, setCheckingNow] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  // const [userId, setUserId] = useState("test123"); // Default test user

  // Create alert removed from Manage Alerts page per design

  // Load alerts and products
  useEffect(() => {
    loadAlerts();
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

  // Product loading and create form removed

  // Alert creation removed from this page

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
        {/* Top Navigation */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back to Home</span>
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Price Alerts
          </h1>
          <p className="text-lg text-gray-700">Manage your alerts and track price drops effortlessly</p>
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

        {/* Actions */}
        <div className="mb-8 flex gap-4 flex-wrap justify-center">
          <button
            onClick={checkAlertsNow}
            disabled={checkingNow}
            className="btn btn-warning disabled:opacity-50"
          >
            {checkingNow ? "Checking..." : "🔍 Check Alerts Now"}
          </button>
          <button
            onClick={exportAlertsCSV}
            className="btn btn-secondary"
          >
            📊 Export CSV
          </button>
          <button
            onClick={exportAlertsPDF}
            className="btn btn-primary"
          >
            📄 Export PDF
          </button>
        </div>

        {/* Create Alert form removed from Manage Alerts */}

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
              <svg
                className="mx-auto h-12 w-12 text-blue-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-600 text-lg">
                No alerts yet. Search a product on the home page and set an alert from its card.
              </p>
              <div className="mt-4">
                <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors font-medium">
                  <span className="text-lg">←</span>
                  Back to Home
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <div key={alert._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white/80">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
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
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
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
                        className="btn btn-outline"
                      >
                        {expandedAlert === alert._id ? "Hide" : "Show"} Chart
                      </button>
                      <button
                        onClick={() => toggleAlert(alert._id, !alert.is_active)}
                        className={`btn ${alert.is_active ? 'btn-danger' : 'btn-success'}`}
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
