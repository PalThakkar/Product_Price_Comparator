"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  async function fetch() {
    setError("");
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);
      const next = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setProducts(next);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to load products"
      );
      setProducts([]);
    }
  }
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">PriceWatch</h1>
      <button
        onClick={fetch}
        className="px-4 py-2 bg-slate-800 text-white rounded"
      >
        Load Products
      </button>
      {error && <p className="text-red-600 mt-3">{error}</p>}
      <ul>
        {products.map((p, idx) => (
          <li key={p._id || p.url || p.productUrl || idx}>
            {p.title} — ₹{p.price ?? p.currentPrice ?? "N/A"}
          </li>
        ))}
      </ul>
    </main>
  );
}
