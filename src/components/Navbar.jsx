"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-slate-800" onClick={closeMobile}>
          FundRise
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/explore" className="hover:text-slate-900">
            Explore Campaigns
          </Link>

          {!user && (
            <>
              <Link href="/login" className="hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                {user.credits} Credits
              </span>
              <NotificationBell />
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <button onClick={logoutUser} className="hover:text-slate-900">
                  Logout
                </button>
              </div>
            </>
          )}

          <a
            href="https://github.com/YOUR_USERNAME/crowdfunding-client"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            Join as Developer
          </a>
        </div>

        {/* Mobile controls: notification bell (if logged in) + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {user && <NotificationBell />}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-slate-600">
          <Link href="/explore" onClick={closeMobile} className="hover:text-slate-900">
            Explore Campaigns
          </Link>

          {!user && (
            <>
              <Link href="/login" onClick={closeMobile} className="hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="bg-slate-900 text-white px-4 py-2 rounded-md text-center"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/dashboard" onClick={closeMobile} className="hover:text-slate-900">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-xs">
                  {user.credits} Credits
                </span>
              </div>
              <button
                onClick={() => {
                  closeMobile();
                  logoutUser();
                }}
                className="text-left hover:text-slate-900"
              >
                Logout
              </button>
            </>
          )}

          <a
            href="https://github.com/YOUR_USERNAME/crowdfunding-client"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            Join as Developer
          </a>  
        </div>
      )}
    </nav>
  );
}