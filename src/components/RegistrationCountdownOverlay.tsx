"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

export default function RegistrationCountdownOverlay() {
  const [showFlash, setShowFlash] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("skipRegistrationClosedOverlay") === "1") {
      sessionStorage.removeItem("skipRegistrationClosedOverlay");
      setDismissed(true);
      return;
    }

    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!data.registrationEnabled) {
            setRegistrationClosed(true);
            setShowFlash(true);
            setTimeout(() => {
              setShowFlash(false);
              setDismissed(true);
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    };
    fetchConfig();
  }, []);

  if (!registrationClosed || dismissed) return null;

  return (
    <AnimatePresence>
      {showFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6"
          onClick={() => {
            setShowFlash(false);
            setDismissed(true);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative max-w-md w-full text-center bg-white rounded-[32px] shadow-2xl p-10 md:p-14"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3">
                  Registration Closed
                </h2>
                <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto leading-relaxed">
                  Ticket registration for অন্তরীপ ২১ is currently closed. Please check back later.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-maroon-600" />
                অন্তরীপ ২১ | Class &apos;26
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
