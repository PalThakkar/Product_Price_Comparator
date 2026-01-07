"use client";

import { useState } from "react";
import axios from "axios";
import AlertModal from "./components/AlertModal";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [counts, setCounts] = useState({
    amazon: 0,
    flipkart: 0,
    croma: 0,
    reliance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter State
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: Infinity,
    selectedSites: { amazon: true, flipkart: true, croma: true, reliance: true },
  });

  // Alert Modal State
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // Apply filters
  const applyFilters = () => {
    let filtered = products.filter((p: any) => {
      const priceMatch = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const site = (p.site || p.retailer || "").toLowerCase();
      const siteMatch = (filters.selectedSites as any)[site] || false;
      return priceMatch && siteMatch;
    });
    setFilteredProducts(filtered);
  };

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${BACKEND_URL}/api/search`, {
        params: { q: searchQuery },
      });
      const allProducts = res.data.results || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setCounts({
        amazon: res.data.amazon || 0,
        flipkart: res.data.flipkart || 0,
        croma: res.data.croma || 0,
        reliance: res.data.reliance || 0,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const openAlertModal = (product: any) => {
    setSelectedProduct(product);
    setIsAlertOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Price Comparator
          </h1>
          <p className="text-lg text-gray-600">
            Search and compare prices across multiple retailers
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex justify-center gap-4">
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign Up
          </a>
          <a
            href="/alerts"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Manage Alerts
          </a>
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

        {/* Filters Panel */}
        {products.length > 0 && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      minPrice: Number(e.target.value) || 0,
                    };
                    setFilters(newFilters);
                    setFilteredProducts(
                      products.filter((p: any) => {
                        const priceMatch =
                          p.price >= newFilters.minPrice &&
                          p.price <= newFilters.maxPrice;
                        const site = (p.site || p.retailer || "").toLowerCase();
                        const siteMatch =
                          (newFilters.selectedSites as any)[site] || false;
                        return priceMatch && siteMatch;
                      })
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice === Infinity ? "" : filters.maxPrice}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      maxPrice: e.target.value === "" ? Infinity : Number(e.target.value),
                    };
                    setFilters(newFilters);
                    setFilteredProducts(
                      products.filter((p: any) => {
                        const priceMatch =
                          p.price >= newFilters.minPrice &&
                          p.price <= newFilters.maxPrice;
                        const site = (p.site || p.retailer || "").toLowerCase();
                        const siteMatch =
                          (newFilters.selectedSites as any)[site] || false;
                        return priceMatch && siteMatch;
                      })
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Site Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retailers
                </label>
                <div className="flex gap-2">
                  {["amazon", "flipkart", "croma", "reliance"].map((site) => (
                    <label key={site} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={(filters.selectedSites as any)[site] || false}
                        onChange={(e) => {
                          const newFilters = {
                            ...filters,
                            selectedSites: {
                              ...filters.selectedSites,
                              [site]: e.target.checked,
                            },
                          };
                          setFilters(newFilters);
                          setFilteredProducts(
                            products.filter((p: any) => {
                              const priceMatch =
                                p.price >= newFilters.minPrice &&
                                p.price <= newFilters.maxPrice;
                              const siteMatch =
                                (newFilters.selectedSites as any)[
                                (p.site || p.retailer || "").toLowerCase()
                              ] ||
                                false;
                              return priceMatch && siteMatch;
                            })
                          );
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs font-medium capitalize">
                        {site}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {products.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Search Results
            </h3>
            <div className="flex gap-4 text-sm">
              <span className="text-orange-600">Amazon: {counts.amazon}</span>
              <span className="text-blue-600">Flipkart: {counts.flipkart}</span>
              <span className="text-green-600">Croma: {counts.croma}</span>
              <span className="text-purple-600">
                Reliance: {counts.reliance}
              </span>
              <span className="text-gray-600">
                Filtered: {filteredProducts.length}
              </span>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Products {filteredProducts.length > 0 && `(${filteredProducts.length})`}
          </h2>

          {loading && <LoadingSkeleton />}

          {!loading && filteredProducts.length === 0 ? (
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
                {products.length > 0
                  ? "No products match your filters. Try adjusting them!"
                  : "No products found. Try searching for products!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((p: any, i: number) => (
                <div
                  key={i}
                  className="border rounded p-4 flex gap-4 hover:bg-gray-50 transition-all card-hover fade-in group shadow-sm hover:shadow-md"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {p.image && (
                    <a href={p.productUrl} target="_blank" className="block">
                      <img
                        src={p.image}
                        className="w-24 h-24 object-contain"
                        alt={p.title}
                      />
                    </a>
                  )}
                  <div className="flex-1">
                    <div
                      className={`text-sm font-semibold ${
                        p.site === "Amazon"
                          ? "text-orange-600"
                          : p.site === "Flipkart"
                          ? "text-blue-600"
                          : p.site === "Croma"
                          ? "text-green-600"
                          : p.site === "Reliance"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    >
                      {p.site}
                    </div>
                    <a
                      href={p.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600 line-clamp-2 mb-2"
                    >
                      {p.title}
                    </a>

                    <div className="flex items-center gap-4 mt-2">
                      {/* Set Alert Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAlertModal(p);
                        }}
                        className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow-md"
                      >
                        🔔 Set Price Alert
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-700 font-bold whitespace-nowrap text-xl">
                      {p.price != null ? `₹${p.price.toLocaleString()}` : "N/A"}
                    </div>
                    <a
                      href={p.productUrl}
                      target="_blank"
                      className="text-sm text-gray-500 block mt-1 hover:underline"
                    >
                      Go to Site
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertModal
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}
