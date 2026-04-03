"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/ticket/verify?email=${encodeURIComponent(email)}&ticketId=${encodeURIComponent(ticketId)}`);
      const data = await res.json();

      if (data.valid) {
        // Store verification in sessionStorage for the duration of the browser tab
        sessionStorage.setItem("verifiedEmail", email);
        sessionStorage.setItem("verifiedId", ticketId);
        
        // Redirect to dashboard
        router.push(`/dashboard?verifiedEmail=${encodeURIComponent(email)}&verifiedId=${encodeURIComponent(ticketId)}`);
      } else {
        setError(data.message || "Invalid Email or Ticket ID combination.");
      }
    } catch {
      setError("An error occurred while verifying. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-offwhite">
      <Navbar />

      <div className="pt-20 lg:pt-32 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 grad-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-maroon-700/20">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-maroon-950 mb-3 tracking-tight">Access Your Pass</h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Already registered? Enter your email and entry code to view your dashboard and download your ticket.
            </p>
          </div>

          <div className="card-premium p-8 md:p-10 shadow-2xl">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-700">Verification Failed</p>
                    <p className="text-red-600 mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Mail className="w-4 h-4 text-maroon-700" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium w-full"
                  placeholder="The email you registered with"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Ticket className="w-4 h-4 text-maroon-700" />
                  Concert Entry Code (Ticket ID)
                </label>
                <input
                  type="text"
                  required
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  className="input-premium w-full text-center tracking-[0.2em] font-black uppercase text-maroon-700"
                  placeholder="e.g. AT-..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary w-full py-4 rounded-xl text-base group"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying Access...
                    </>
                  ) : (
                    <>
                      Unlock Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 font-semibold uppercase tracking-widest mt-10">
            অন্তরীপ ২১ Farewell Concert Â· Secure Entry Portal
          </p>
        </motion.div>
      </div>
    </main>
  );
}

