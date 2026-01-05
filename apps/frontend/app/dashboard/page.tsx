"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { isLoggedIn } from "../utils/auth";

export default function DashboardPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
            return;
        }
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BACKEND_URL}/api/alerts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(res.data);
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600">Overview of your tracked products and alerts</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Total Tracked Items</h3>
                        <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {alerts.filter((a: any) => a.is_active).length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">Triggered Alerts</h3>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Your Watchlist</h2>
                        <a href="/alerts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Manage Alerts →
                        </a>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading your data...</div>
                    ) : alerts.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 mb-4">You haven't tracked any products yet.</p>
                            <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                Start Searching
                            </a>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {alerts.map((alert: any) => (
                                <div key={alert._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        {alert.product_id?.image && (
                                            <img src={alert.product_id.image} alt="" className="w-12 h-12 object-contain" />
                                        )}
                                        <div>
                                            <h4 className="font-medium text-gray-900">{alert.product_id?.title}</h4>
                                            <div className="flex gap-2 text-sm text-gray-500">
                                                <span>{alert.product_id?.site}</span>
                                                <span>•</span>
                                                <span>Target: ₹{alert.target_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{alert.product_id?.currentPrice?.toLocaleString()}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {alert.is_active ? 'Active' : 'Paused'}
                                        </span>
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
