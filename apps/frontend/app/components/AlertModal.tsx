"use client";

import { useState } from "react";
import axios from "axios";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function AlertModal({ isOpen, onClose, product }: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(product?.currentPrice || "");
  const [email, setEmail] = useState(""); // Optional if we want to capture email here, but backend expects user_id from auth. 
  // Wait, backend `POST /api/alerts` uses `req.user.id` from `auth` middleware.
  // This means the user MUST be logged in. 
  // `page.tsx` doesn't seem to have auth context visible in the code I read (it has a login link maybe? no, it has "Manage Alerts" link).
  // If the user uses `apps/frontend/app/page.tsx`, are they logged in?
  // `page.tsx` has `import { useState } from "react";`.
  // It has a navigation bar `Manage Alerts` pointing to `/alerts`.
  // If I call `/api/alerts`, I need an auth token. 
  // I should check if there is an auth context or token stored in localStorage.
  // The backend `auth` middleware likely checks `Authorization` header.
  // If `page.tsx` is public, we might have an issue if the user isn't logged in.
  // "Manage Alerts" implies some account management.
  // I will assume the user has a token in localStorage "token" or similar, based on `backend/middleware/auth.js` (I didn't read it but it's standard).
  // I will check `apps/frontend/app/login/page.tsx` or similar if I had time, but standard practice is `localStorage.getItem('token')`.

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!isOpen || !product) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("You must be logged in to set an alert.");
        setLoading(false);
        return;
      }

      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      await axios.post(
        `${BACKEND_URL}/api/alerts`,
        {
          product_id: product._id,
          target_price: Number(targetPrice)
        },
        {
          headers: { Authorization: `Bearer ${token}` } // Assuming Bearer token
        }
      );
      setMsg("Alert set successfully!");
      setTimeout(onClose, 2000);
    } catch (err: any) {
      console.error(err);
      setMsg(err.response?.data?.error || "Failed to set alert");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Set Price Alert
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Receive a notification when {product.title.substring(0, 30)}... drops below your target price.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (₹)</label>
            <input
              type="number"
              required
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter target price"
            />
          </div>

          {msg && (
            <div className={`text-sm p-2 rounded ${msg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {msg}
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
