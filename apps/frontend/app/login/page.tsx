"use client";

import { useState } from "react";
import api from "../utils/axios";
import { saveAuth } from "../utils/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      saveAuth(res.data.token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-3 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
