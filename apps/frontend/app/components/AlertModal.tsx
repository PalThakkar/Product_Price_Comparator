"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function AlertModal({
  isOpen,
  onClose,
  product,
}: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(
    product?.currentPrice || product?.price || ""
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // Fetch price suggestion when modal opens
  useEffect(() => {
    if (isOpen && product?._id) {
      fetchPriceSuggestion();
    }
  }, [isOpen, product?._id]);

  async function fetchPriceSuggestion() {
    setLoadingSuggestion(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/suggestions/${product._id}`
      );
      setSuggestion(res.data);
    } catch (err) {
      console.warn("Could not fetch price suggestion:", err);
      setSuggestion(null);
    } finally {
      setLoadingSuggestion(false);
    }
  }

  if (!isOpen || !product) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg(
          "Please login or signup to set price alerts. Click 'Manage Alerts' to create an account."
        );
        setLoading(false);
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/alerts`,
        {
          product_id: product._id,
          target_price: Number(targetPrice),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMsg("Alert set successfully!");
      setTimeout(onClose, 2000);
    } catch (err: any) {
      console.error("Alert creation error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Failed to set alert";
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Set Price Alert
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Receive a notification when {product.title.substring(0, 30)}... drops
          below your target price.
        </p>

        {/* Price Suggestion Card */}
        {loadingSuggestion ? (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg animate-pulse">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          </div>
        ) : suggestion ? (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                  💡 Smart Recommendation
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{suggestion.suggestedPrice?.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600">Save</p>
                <p className="text-lg font-bold text-green-600">
                  {suggestion.priceDropPercentage}%
                </p>
              </div>
            </div>
            <p className="text-xs text-green-700 mb-3 italic">
              {suggestion.reasoning}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="bg-white p-2 rounded border border-green-200">
                <p className="text-gray-600 font-medium">Min</p>
                <p className="font-bold text-gray-800">
                  ₹{suggestion.minPrice?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-green-200">
                <p className="text-gray-600 font-medium">Avg</p>
                <p className="font-bold text-gray-800">
                  ₹{suggestion.avgPrice?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-green-200">
                <p className="text-gray-600 font-medium">Current</p>
                <p className="font-bold text-gray-800">
                  ₹{suggestion.currentPrice?.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTargetPrice(suggestion.suggestedPrice)}
              className="w-full px-3 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              ✓ Use This Suggestion
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Price (₹)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Current price: ₹{product.price || product.currentPrice}. Set a
              lower price for an alert.
            </p>
            <input
              type="number"
              required
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter target price (must be less than current)"
              max={product.price || product.currentPrice}
            />
          </div>

          {msg && (
            <div
              className={`text-sm p-3 rounded ${
                msg.includes("success")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {msg}
              {msg.includes("login") && (
                <div className="mt-2 flex gap-2">
                  <a
                    href="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login
                  </a>
                  <span>or</span>
                  <a
                    href="/signup"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-70 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Setting..." : "Set Alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
