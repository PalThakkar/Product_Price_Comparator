"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "../utils/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
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
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          {loggedIn ? (
            <>
              <Link href="/alerts" className="hover:text-blue-600">
                Alerts
              </Link>

              <button
                onClick={logout}
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link href="/signup" className="hover:text-blue-600">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
