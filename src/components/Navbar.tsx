"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Menu, X, LayoutDashboard, LogOut, User, CheckCircle, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
  { href: "/verify", label: "Access Ticket" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    
    // Sync verification state from sessionStorage if session is null
    if (!session) {
      const email = sessionStorage.getItem("verifiedEmail");
      setVerifiedEmail(email);
    } else {
      setVerifiedEmail(null);
    }
    
    return () => window.removeEventListener("scroll", handler);
  }, [session]);

  const handleSignOut = () => {
    sessionStorage.removeItem("verifiedEmail");
    sessionStorage.removeItem("verifiedId");
    signOut({ callbackUrl: "/" });
  };

  const clearVerifiedSession = () => {
    sessionStorage.removeItem("verifiedEmail");
    sessionStorage.removeItem("verifiedId");
    setVerifiedEmail(null);
    window.location.href = "/";
  };

  const userDisplayName = session?.user?.name || verifiedEmail?.split("@")[0] || "Guest";
  const userRole = session ? "Google Account" : verifiedEmail ? "Verified Ticket" : "Guest Access";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-maroon-700/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 grad-maroon rounded-xl flex items-center justify-center shadow-lg shadow-maroon-700/20 group-hover:scale-110 transition-transform duration-300">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-black text-maroon-950 tracking-tight leading-none">Antorip</span>
            <span className="block text-[11px] font-bold text-maroon-600/60 uppercase tracking-[0.2em] mt-0.5">Farewell</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/30 p-1.5 rounded-2xl border border-slate-200/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                pathname === link.href
                  ? "text-maroon-700 bg-white shadow-sm shadow-maroon-700/5 ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-maroon-950"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Profile / CTA */}
        <div className="hidden md:flex items-center gap-3">
          {(session || verifiedEmail) ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] font-black text-maroon-600/40 uppercase tracking-widest leading-none mb-1">
                  {userRole}
                </span>
                <span className="text-sm font-black text-maroon-950 truncate max-w-[140px]">
                  {userDisplayName}
                </span>
              </div>
              <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
                <div className="w-9 h-9 grad-maroon rounded-full flex items-center justify-center shadow-lg shadow-maroon-700/10 ring-2 ring-white overflow-hidden">
                  <User className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={session ? handleSignOut : clearVerifiedSession}
                  className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="btn-primary text-xs font-black uppercase tracking-[0.2em] px-8 py-3 rounded-2xl shadow-xl shadow-maroon-700/20"
            >
              Register Now
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-maroon-700 hover:bg-maroon-700/8 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-2xl border-b border-slate-100 shadow-2xl"
          >
            <div className="p-6 space-y-2">
              {(session || verifiedEmail) && (
                <div className="p-5 mb-4 bg-cream rounded-2xl border border-maroon-700/5 flex items-center gap-4">
                   <div className="w-12 h-12 grad-maroon rounded-full flex items-center justify-center shadow-inner">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-maroon-600/40 uppercase tracking-widest leading-none mb-1">{userRole}</p>
                    <p className="text-base font-black text-maroon-950 leading-tight">{userDisplayName}</p>
                  </div>
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest ${
                    pathname === link.href
                      ? "text-maroon-700 bg-maroon-700/5 border border-maroon-700/10"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                {(session || verifiedEmail) ? (
                  <button
                    onClick={session ? handleSignOut : clearVerifiedSession}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest border border-red-100"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out from Concert Portal
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center grad-maroon py-5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-maroon-700/20"
                  >
                    Get Entry Pass
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
