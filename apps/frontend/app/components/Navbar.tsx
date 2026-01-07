"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "../utils/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setLoggedIn(isLoggedIn());
    // Initial check
    check();
    // Update on window focus (common after returning from login/signup)
    window.addEventListener("focus", check);
    // Update on storage changes from other tabs
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("focus", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* LEFT - LOGO */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          PriceComparator
        </Link>

        {/* RIGHT - LINKS */}
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600 font-medium">
            Search
          </Link>

          {/* <Link href="/features" className="hover:text-purple-600 font-medium">
            ✨ Features
          </Link> */}

          {loggedIn ? (
            <>
              <Link href="/alerts" className="hover:text-blue-600 font-medium">
                🔔 Alerts
              </Link>

              <button
                onClick={() => {
                  logout();
                  setLoggedIn(false);
                }}
                className="text-red-600 hover:underline font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600 font-medium">
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
