"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // const handleSearch = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await axios.get(`${BACKEND_URL}/api/products`);
  //     setProducts(response.data);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch products");
  //     console.error("Error fetching products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  async function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.get(`${BACKEND_URL}/api/products`, {
      params: { query: searchQuery }
    });
    setProducts(res.data.results || []); // results array
  // } catch (err: any) {
  //   setError(err?.message || "Failed to fetch products");
  }catch (err: any) {
  const msg = err?.response?.data?.error || err?.message || "Failed to fetch products";
  setError(msg);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Price Comparator
          </h1>
          <p className="text-lg text-gray-600">
            Search and compare prices across multiple retailers
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Products List */}
<div className="bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    Products {products.length > 0 && `(${products.length})`}
  </h2>

  {products.length === 0 ? (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p className="text-gray-500 text-lg">
        No products found. Try searching for products!
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {products.map((p: any, i: number) => (
        <a
          key={i}
          href={p.productUrl}
          target="_blank"
          className="border rounded p-4 flex gap-4 hover:bg-gray-50"
        >
          {p.image && (
            <img
              src={p.image}
              className="w-20 h-20 object-contain"
              alt={p.title}
            />
          )}
          <div className="flex-1">
            <div className="text-sm text-gray-500">{p.site}</div>
            <div className="font-medium">{p.title}</div>
          </div>
          <div className="text-green-700 font-bold whitespace-nowrap">
            {p.price != null ? `₹${p.price.toLocaleString()}` : "N/A"}
          </div>
        </a>
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
}
