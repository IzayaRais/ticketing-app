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

  const handleEmailOnlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/ticket/email?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.exists && data.ticket) {
        const tId = data.ticket.ticketId;
        // Store verification in sessionStorage
        sessionStorage.setItem("verifiedEmail", email);
        sessionStorage.setItem("verifiedId", tId);
        
        // Redirect to dashboard
        router.push(`/dashboard?verifiedEmail=${encodeURIComponent(email)}&verifiedId=${encodeURIComponent(tId)}`);
      } else {
        setError("No registration found for this email. Please register first or check your email.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-offwhite pb-20">
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
            <h1 className="text-4xl font-black text-maroon-950 mb-3 tracking-tight uppercase">Ticket Portal</h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Retrieve your entry pass in seconds. Use your email or entry code to access your ticket.
            </p>
          </div>

          <div className="card-premium p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon-600 via-amber-500 to-maroon-800" />
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mb-8 flex items-start gap-4 p-5 bg-red-50/80 border border-red-100 rounded-2xl text-sm backdrop-blur-sm"
                >
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-red-900 uppercase tracking-wider text-xs mb-1">Access Protocol Failed</p>
                    <p className="text-red-700/80 font-semibold">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-10">
              {/* Email Only Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-maroon-700 rounded-full" />
                  <span className="text-[10px] font-black text-maroon-700 uppercase tracking-[0.3em]">Quick Access by Email</span>
                </div>
                
                <form onSubmit={handleEmailOnlyAccess} className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      Email Identity
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-premium w-full text-base font-bold bg-slate-50/50"
                      placeholder="e.g. raisul@university.edu"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="btn-primary w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] group shadow-lg shadow-maroon-700/10"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Download Ticket via Email
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">or use code</span>
              </div>

              {/* Legacy Code Verification */}
              <form onSubmit={handleVerify} className="space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">
                    Concert Entry Code
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                    className="bg-transparent text-2xl font-black text-center tracking-[0.4em] outline-none w-full text-maroon-700 placeholder:text-slate-100"
                    placeholder="AT-XXXXXX"
                  />
                  <div className="w-2/3 h-px bg-slate-100 mx-auto" />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-maroon-700 transition-colors"
                >
                  Verify with Entry Code
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mt-12 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-slate-200" />
            ACCESS PORTAL v2.0
            <span className="w-8 h-px bg-slate-200" />
          </p>
        </motion.div>
      </div>
    </main>
  );
}
