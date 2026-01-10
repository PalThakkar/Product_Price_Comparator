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
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
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
              <Link href="/alerts" className="btn btn-secondary">
                🔔 Alerts
              </Link>

              <button
                onClick={() => {
                  logout();
                  setLoggedIn(false);
                }}
                className="btn btn-danger"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>

              <Link href="/signup" className="btn btn-success">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
