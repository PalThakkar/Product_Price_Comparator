"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceDataPoint {
  date: string;
  price: number;
  timestamp: string;
}

interface PriceHistoryChartProps {
  priceHistory: Array<{ price: number; at: string }>;
  targetPrice: number;
  currentPrice: number;
  productTitle: string;
}

export default function PriceHistoryChart({
  priceHistory,
  targetPrice,
  currentPrice,
  productTitle,
}: PriceHistoryChartProps) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No price history available yet</p>
      </div>
    );
  }

  // Format data for chart
  const chartData: PriceDataPoint[] = priceHistory
    .slice(-30) // Show last 30 price points
    .map((item) => ({
      price: item.price,
      date: new Date(item.at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(item.at).toISOString(),
    }))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  // Calculate stats
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  );
  const savings = currentPrice - minPrice;
  const savingsPercent = Math.round((savings / currentPrice) * 100);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Current Price</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{currentPrice.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Target Price</p>
          <p className="text-2xl font-bold text-orange-600">
            ₹{targetPrice.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Lowest Price</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{minPrice.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Potential Savings</p>
          <p className="text-2xl font-bold text-green-700">
            {savingsPercent}%
            <span className="text-sm ml-1">(₹{savings.toLocaleString()})</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Price Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value: any) =>
                `₹${(Number(value) / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name="Price"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey={() => targetPrice}
              stroke="#f97316"
              strokeDasharray="5 5"
              dot={false}
              name="Target Price"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Best Deal:</strong> Price dropped to ₹
            {minPrice.toLocaleString()} on{" "}
            {chartData.find((d) => d.price === minPrice)?.date}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Average Price:</strong> ₹{avgPrice.toLocaleString()} over{" "}
            {chartData.length} price checks
          </p>
        </div>
      </div>
    </div>
  );
}
