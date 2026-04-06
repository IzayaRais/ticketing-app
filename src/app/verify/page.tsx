"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Hash,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";

type Method = "email" | "code";

export default function VerifyPage() {
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  const handleEmailAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/ticket/email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.exists && data.ticket) {
        const tId = data.ticket.ticketId;
        sessionStorage.setItem("verifiedEmail", email);
        sessionStorage.setItem("verifiedId", tId);
        router.push(`/dashboard?verifiedEmail=${encodeURIComponent(email)}&verifiedId=${encodeURIComponent(tId)}`);
      } else {
        setError("No registration found for this email. Please register first or double-check the address.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !email) { setError("Enter both your email and ticket code."); return; }
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/ticket/verify?email=${encodeURIComponent(email)}&ticketId=${encodeURIComponent(ticketId)}`);
      const data = await res.json();
      if (data.valid) {
        sessionStorage.setItem("verifiedEmail", email);
        sessionStorage.setItem("verifiedId", ticketId);
        router.push(`/dashboard?verifiedEmail=${encodeURIComponent(email)}&verifiedId=${encodeURIComponent(ticketId)}`);
      } else {
        setError(data.message || "Invalid email or ticket code combination.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-offwhite">
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-maroon-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-amber-100/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative pt-24 pb-20 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 grad-maroon rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-maroon-700/25">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <p className="text-[10px] font-black text-maroon-600 uppercase tracking-[0.3em] mb-2">
              অন্তরীপ ২১ • Farewell Event
            </p>
            <h1 className="text-3xl font-black text-maroon-950 tracking-tight uppercase mb-2">
              Access Your Ticket
            </h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Choose how you want to retrieve your entry pass.
            </p>
          </div>

          {/* Method Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200 rounded-2xl mb-6">
            {(["email", "code"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); clearError(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  method === m
                    ? "bg-white text-maroon-800 shadow-sm border border-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {m === "email" ? <Mail className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                {m === "email" ? "By Email" : "By Code"}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card */}
          <div className="card-premium relative overflow-hidden">
            {/* Top color bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon-700 via-amber-500 to-maroon-800" />

            <AnimatePresence mode="wait">
              {/* ─── Email Method ─── */}
              {method === "email" && (
                <motion.form
                  key="email-form"
                  onSubmit={handleEmailAccess}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 space-y-5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-maroon-50 border border-maroon-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4 text-maroon-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Quick Email Access</p>
                        <p className="text-[10px] text-slate-400 font-medium">Fastest way to retrieve your ticket</p>
                      </div>
                    </div>

                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      className="input-premium w-full"
                      placeholder="e.g. your.name@university.edu"
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-2">
                      Use the email you registered with. Your ticket will load instantly.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="btn-primary w-full py-4 text-xs tracking-[0.15em] group"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Find My Ticket
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMethod("code"); clearError(); }}
                    className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-maroon-600 transition-colors uppercase tracking-widest"
                  >
                    Have a ticket code instead?
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </motion.form>
              )}

              {/* ─── Code Method ─── */}
              {method === "code" && (
                <motion.form
                  key="code-form"
                  onSubmit={handleCodeVerify}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 space-y-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                      <Hash className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Verify by Entry Code</p>
                      <p className="text-[10px] text-slate-400 font-medium">From your confirmation email</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      className="input-premium w-full"
                      placeholder="e.g. your.name@university.edu"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      Ticket Code
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketId}
                      onChange={(e) => { setTicketId(e.target.value.toUpperCase()); clearError(); }}
                      className="input-premium w-full font-black tracking-[0.25em] text-maroon-800 uppercase"
                      placeholder="AT-XXXXXX"
                      maxLength={12}
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                      Your 8-digit code starts with <span className="font-black text-maroon-600">AT-</span>. Check your confirmation email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="btn-primary w-full py-4 text-xs tracking-[0.15em] group"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        Verify &amp; Access Ticket
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMethod("email"); clearError(); }}
                    className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-maroon-600 transition-colors uppercase tracking-widest"
                  >
                    Don&apos;t have a code? Use email instead
                    <ChevronDown className="w-3 h-3 rotate-180" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Help text */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <p className="text-[11px] font-bold text-amber-800 text-center leading-relaxed">
              🎫 &nbsp;Haven&apos;t registered yet?{" "}
              <a href="/" className="underline text-maroon-700 hover:text-maroon-900 transition-colors">
                Register now on the homepage
              </a>{" "}
              before the event on <strong>April 09, 2026</strong>.
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em] mt-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-slate-200" />
            Access Portal v2.0
            <span className="w-8 h-px bg-slate-200" />
          </p>
        </motion.div>
      </div>
    </main>
  );
}
