"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Clock, AlertCircle, ShieldAlert } from "lucide-react";

export default function RegistrationCountdownOverlay() {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [appConfig, setAppConfig] = useState<{ registrationEnabled: boolean } | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setAppConfig(data);
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
    const interval = setInterval(fetchConfig, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Target: April 8, 2026 at 1:00 PM (13:00)
    const target = new Date("2026-04-08T13:00:00+06:00").getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = target - now;

      // If configuration explicitly enables registration, hide the overlay
      if (appConfig?.registrationEnabled === true) {
        setIsVisible(false);
        return;
      }

      // Otherwise, show if registration is disabled OR if we are still before the target date
      if (diff <= 0 && appConfig?.registrationEnabled !== false) {
        setIsVisible(false);
        setTimeLeft(null);
        return;
      }

      setIsVisible(true);
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [appConfig]);

  if (configLoading || !isVisible || !timeLeft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950 p-6 md:p-12 overflow-hidden"
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-maroon-700/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-maroon-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-3xl w-full text-center">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Header Icon */}
            <div className="mb-12 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-maroon-600 to-maroon-950 rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(153,27,27,0.4)] animate-bounce-slow">
                <ShieldAlert className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-slate-950 animate-ping" />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9] uppercase italic">
              Ticket Generation <br />
              <span className="text-maroon-500">Paused</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-bold max-w-lg mb-16 tracking-tight leading-relaxed">
              We are currently optimizing the registration system.
              <span className="block text-maroon-400 mt-2">Registration will resume precisely at 1:00 PM.</span>
            </p>

            {/* Timer Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
              {[
                { label: "Hours", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div key={unit.label} className="group">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center mb-3 backdrop-blur-xl transition-all group-hover:bg-white/10 group-hover:border-maroon-500/30">
                    <span className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-maroon-400 transition-colors">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Message */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <Clock className="w-4 h-4 text-maroon-500 animate-spin-slow" />
                <span className="text-sm font-black text-white/80 uppercase tracking-widest">
                  Live Countdown Active
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-8 py-4 border-t border-white/5 w-full justify-center">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-maroon-600 animate-pulse" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">अंतরীপ ২১ | Class 26</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
