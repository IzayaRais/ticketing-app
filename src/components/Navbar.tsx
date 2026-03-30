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
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
            <Ticket className="w-5 h-5 text-slate-900" />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-black text-white tracking-tight leading-none">Antorip</span>
            <span className="block text-[11px] font-bold text-amber-500/60 uppercase tracking-[0.2em] mt-0.5">Farewell</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                pathname === link.href
                  ? "text-slate-900 bg-amber-500 shadow-sm shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
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
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                  {userRole}
                </span>
                <span className="text-sm font-bold text-white truncate max-w-[140px]">
                  {userDisplayName}
                </span>
              </div>
              <div className="flex items-center gap-1 pl-3 border-l border-slate-700">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/10 ring-2 ring-slate-800 overflow-hidden">
                  <User className="w-4 h-4 text-slate-900" />
                </div>
                <button
                  onClick={session ? handleSignOut : clearVerifiedSession}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300"
            >
              Register Now
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
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
            className="md:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 shadow-2xl"
          >
            <div className="p-6 space-y-2">
              {(session || verifiedEmail) && (
                <div className="p-5 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                     <User className="w-6 h-6 text-slate-900" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{userRole}</p>
                     <p className="text-base font-bold text-white leading-tight">{userDisplayName}</p>
                   </div>
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest ${
                    pathname === link.href
                      ? "text-slate-900 bg-amber-500 border border-amber-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800">
                {(session || verifiedEmail) ? (
                  <button
                    onClick={session ? handleSignOut : clearVerifiedSession}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 py-5 rounded-2xl text-slate-900 text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.3)]"
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
