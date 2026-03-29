"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2, Ticket, Mail, Download,
  Home, Share2, Loader2, Copy, Check
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("id");
  const email = searchParams.get("email");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!ticketId) return;
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/ticket/pdf?id=${ticketId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${ticketId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Check icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-maroon-950 mb-3">
            You&apos;re registered!
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Your ticket has been generated and sent to{" "}
            <span className="font-bold text-maroon-700">{email}</span>. Check your inbox!
          </p>
        </motion.div>

        {/* Ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium overflow-hidden mb-6"
        >
          {/* Top bar */}
          <div className="grad-maroon px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm font-bold uppercase tracking-widest">
                Antorip Farewell · Concert Pass
              </span>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/25" />
              ))}
            </div>
          </div>

          {/* Ticket body */}
          <div className="px-8 py-7">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              Confirmation ID
            </p>
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl font-black text-maroon-700 tracking-[0.12em]">
                {ticketId || "—"}
              </span>
              <button
                onClick={copyId}
                className="p-2 rounded-lg bg-maroon-700/8 hover:bg-maroon-700/15 transition-colors text-maroon-700"
                title="Copy ticket ID"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="mx-8 border-t-2 border-dashed border-slate-100" />

          {/* Footer row */}
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-500 truncate max-w-[200px]">{email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-600">Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Email notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8 text-sm"
        >
          <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 font-medium">
            Your PDF ticket has been emailed. Check your spam folder if you don&apos;t see it within a minute.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <button
            onClick={handleDownload}
            disabled={isDownloading || !ticketId}
            className="btn-primary justify-center py-4 rounded-xl"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isDownloading ? "Generating…" : "Download PDF"}
          </button>

          <Link href="/" className="btn-outline justify-center py-4 rounded-xl">
            <Home className="w-5 h-5" /> Return Home
          </Link>
        </motion.div>

        <p className="text-center text-xs text-slate-400 font-medium mt-6">
          Present your ticket ID at the event entrance for verification.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-offwhite">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
