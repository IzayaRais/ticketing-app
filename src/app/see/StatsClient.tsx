"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Users,
  School,
  Activity,
  RefreshCcw,
  QrCode,
  Zap,
  Droplet,
  Clock,
  ShieldAlert,
  ZapOff,
  Volume2,
  VolumeX,
  TrendingUp,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Radio,
  BarChart3,
  Eye,
  LogOut,
  Wifi,
  WifiOff,
  ChevronUp,
  ChevronDown,
  Minus,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Scan {
  ticketId: string;
  fullName: string;
  university: string;
  timestamp: string;
}

interface Alert {
  type: string;
  timestamp: string;
  ticketId: string;
  details: string;
}

interface HistoryPoint {
  time: string;
  count: number;
}

export interface DashboardStats {
  totalReg: number;
  scansDone: number;
  maleCount: number;
  femaleCount: number;
  duplicateScans: number;
  universityCounts: Record<string, number>;
  scannerCounts: Record<string, number>;
  bloodGroupCounts: Record<string, number>;
  currentVelocity: number;
  scanHistory: HistoryPoint[];
  recentScans: Scan[];
  securityAlerts: Alert[];
  serverStatus: "operational" | "degraded" | "offline" | "error";
  lastUpdated?: string;
}

const UNIVERSITY_COLORS: Record<string, string> = {
  MIST: "#7f0000",
  BUP: "#1d4ed8",
  AFMC: "#059669",
};

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  trend,
  color = "default",
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "green" | "red" | "blue" | "orange";
  delay?: number;
}) {
  const colorMap = {
    default: {
      bg: "bg-slate-800/50",
      border: "border-slate-700/50",
      icon: "bg-slate-700/60 text-slate-300",
      value: "text-white",
      accent: "from-slate-700/0 via-slate-600/5 to-slate-700/0",
    },
    green: {
      bg: "bg-emerald-900/20",
      border: "border-emerald-700/30",
      icon: "bg-emerald-900/50 text-emerald-400",
      value: "text-emerald-300",
      accent: "from-emerald-600/0 via-emerald-500/5 to-emerald-600/0",
    },
    red: {
      bg: "bg-rose-900/20",
      border: "border-rose-700/30",
      icon: "bg-rose-900/50 text-rose-400",
      value: "text-rose-300",
      accent: "from-rose-600/0 via-rose-500/5 to-rose-600/0",
    },
    blue: {
      bg: "bg-blue-900/20",
      border: "border-blue-700/30",
      icon: "bg-blue-900/50 text-blue-400",
      value: "text-blue-300",
      accent: "from-blue-600/0 via-blue-500/5 to-blue-600/0",
    },
    orange: {
      bg: "bg-orange-900/20",
      border: "border-orange-700/30",
      icon: "bg-orange-900/50 text-orange-400",
      value: "text-orange-300",
      accent: "from-orange-600/0 via-orange-500/5 to-orange-600/0",
    },
  };
  const c = colorMap[color];
  const TrendIcon =
    trend === "up" ? ChevronUp : trend === "down" ? ChevronDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border ${c.bg} ${c.border} p-5 group hover:scale-[1.02] transition-transform duration-200`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${c.accent} pointer-events-none`}
      />
      <div className="relative flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="relative flex items-baseline gap-2">
        <p className={`text-3xl font-black tracking-tight ${c.value}`}>{value}</p>
        {trend && (
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        )}
      </div>
      {sub && (
        <p className="relative mt-1 text-[10px] font-semibold text-slate-500">{sub}</p>
      )}
    </motion.div>
  );
}

function MiniBarChart({ data }: { data: HistoryPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full opacity-20">
        <BarChart3 className="w-8 h-8 text-slate-500" />
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.count)) || 1;

  return (
    <div className="flex items-end gap-1 h-full w-full px-1">
      {data.map((item, idx) => {
        const pct = (item.count / max) * 100;
        const isLatest = idx === data.length - 1;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              <div className="bg-slate-800 border border-slate-700 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-xl">
                {item.count} scans
              </div>
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(pct, 2)}%` }}
              transition={{ delay: idx * 0.03, duration: 0.5, ease: "easeOut" }}
              className={`w-full rounded-t-sm transition-colors duration-200 ${
                isLatest
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-slate-600 group-hover:bg-slate-500"
              }`}
            />
            <span className="text-[7px] font-bold text-slate-600 group-hover:text-slate-400 whitespace-nowrap">
              {item.time.split(":")[0]}h
            </span>
          </div>
        );
      })}
    </div>
  );
}

function UniversityBreakdown({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full opacity-20">
        <School className="w-8 h-8 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(([uni, count], idx) => {
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
        const color = UNIVERSITY_COLORS[uni] || "#6b7280";
        return (
          <div key={uni}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] font-bold text-slate-200">{uni}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white">{count}</span>
                <span className="text-[9px] font-bold text-slate-500">{pct}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BloodGroupGrid({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const bloodColors: Record<string, string> = {
    "A+": "text-red-400 border-red-800/30 bg-red-900/20",
    "A-": "text-red-300 border-red-800/30 bg-red-900/10",
    "B+": "text-orange-400 border-orange-800/30 bg-orange-900/20",
    "B-": "text-orange-300 border-orange-800/30 bg-orange-900/10",
    "O+": "text-rose-400 border-rose-800/30 bg-rose-900/20",
    "O-": "text-rose-300 border-rose-800/30 bg-rose-900/10",
    "AB+": "text-pink-400 border-pink-800/30 bg-pink-900/20",
    "AB-": "text-pink-300 border-pink-800/30 bg-pink-900/10",
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {entries.map(([bg, count]) => (
        <div
          key={bg}
          className={`flex flex-col items-center p-2 rounded-xl border ${
            bloodColors[bg] || "text-slate-400 border-slate-700 bg-slate-800/50"
          }`}
        >
          <span className="text-[10px] font-black">{bg}</span>
          <span className="text-base font-black text-white">{count}</span>
        </div>
      ))}
    </div>
  );
}

function LiveFeed({ scans, searchTerm }: { scans: Scan[]; searchTerm: string }) {
  const filtered = scans.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
        <ZapOff className="w-8 h-8 text-slate-500" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {searchTerm ? `No results for "${searchTerm}"` : "Awaiting check-ins"}
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {filtered.slice(0, 20).map((scan, idx) => {
        const uniColor = UNIVERSITY_COLORS[scan.university] || "#6b7280";
        const initial = scan.fullName
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        const time = new Date(scan.timestamp);
        const timeStr = isNaN(time.getTime())
          ? ""
          : time.toLocaleTimeString("en-BD", {
              hour: "2-digit",
              minute: "2-digit",
            });

        return (
          <motion.div
            key={scan.ticketId}
            layout
            initial={{ opacity: 0, x: -16, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 16, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-lg"
              style={{ backgroundColor: uniColor + "33", border: `1px solid ${uniColor}44` }}
            >
              <span style={{ color: uniColor }}>{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-100 truncate">{scan.fullName}</p>
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{scan.university}</p>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400">{timeStr}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-bold text-emerald-600 uppercase">In</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

function SecurityAlerts({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">All Clear</p>
        <p className="text-[9px] text-slate-600 text-center">No security flags detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => {
        const isDuplicate = alert.type === "duplicate";
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border ${
              isDuplicate
                ? "bg-orange-900/20 border-orange-700/30"
                : "bg-rose-900/20 border-rose-700/30"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle
                  className={`w-3 h-3 ${isDuplicate ? "text-orange-400" : "text-rose-400"}`}
                />
                <span
                  className={`text-[9px] font-black uppercase tracking-wider ${
                    isDuplicate ? "text-orange-400" : "text-rose-400"
                  }`}
                >
                  {alert.type}
                </span>
              </div>
              <span className="text-[8px] font-bold text-slate-500">
                {new Date(alert.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 font-mono">{alert.ticketId}</p>
            <p className="text-[9px] text-slate-500 mt-0.5 truncate">{alert.details}</p>
          </div>
        );
      })}
    </div>
  );
}

function ScannerBoard({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-16 opacity-20">
        <p className="text-[10px] text-slate-500 uppercase font-bold">No scanner data</p>
      </div>
    );
  }

  const max = entries[0]?.[1] || 1;

  return (
    <div className="space-y-2.5">
      {entries.map(([name, count], idx) => (
        <div key={name} className="flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-500 w-4 text-center">
            #{idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-200 truncate">{name}</span>
              <span className="text-[10px] font-black text-orange-400 ml-2">{count}</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatsClient({ initialStats }: { initialStats: DashboardStats }) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMounting, setIsMounting] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [newScanFlash, setNewScanFlash] = useState(false);
  const [prevScanCount, setPrevScanCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem("see_auth_v2");
    if (savedAuth === "true") setIsAuthenticated(true);
    setIsMounting(false);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "EECE20") {
      setIsAuthenticated(true);
      localStorage.setItem("see_auth_v2", "true");
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 600);
      setPassInput("");
    }
  };

  useEffect(() => {
    if (isAudioEnabled && !audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) setAudioContext(new AudioCtx());
    }
  }, [isAudioEnabled, audioContext]);

  const playBeep = useCallback(
    (freq = 880, duration = 0.1) => {
      if (!isAudioEnabled || !audioContext) return;
      try {
        if (audioContext.state === "suspended") audioContext.resume();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + duration
        );
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
      } catch {}
    },
    [audioContext, isAudioEnabled]
  );

  useEffect(() => {
    const timer = setInterval(() => setSecondsSinceUpdate((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.scansDone > prevScanCount) {
        playBeep(880, 0.15);
        setNewScanFlash(true);
        setTimeout(() => setNewScanFlash(false), 800);
      }
      if (data.duplicateScans > stats.duplicateScans) {
        playBeep(220, 0.3);
      }
      setPrevScanCount(data.scansDone);
      setStats(data);
      setSecondsSinceUpdate(0);
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [prevScanCount, stats.duplicateScans, playBeep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuthenticated) {
      interval = setInterval(() => {
        if (document.visibilityState === "visible") refreshData();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [refreshData, isAuthenticated]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const attendancePct =
    stats.totalReg > 0
      ? ((stats.scansDone / stats.totalReg) * 100).toFixed(1)
      : "0.0";
  const successRate =
    stats.scansDone + stats.duplicateScans > 0
      ? Math.round(
          (stats.scansDone / (stats.scansDone + stats.duplicateScans)) * 100
        )
      : 100;
  const isOnline = stats.serverStatus === "operational";

  if (isMounting) return <div className="h-screen bg-[#020617]" />;

  // ─── Auth Gate ───────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden relative">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-maroon-900/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-sm"
        >
          {/* Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            {/* Top accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-maroon-500/50 to-transparent rounded-full" />

            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={passError ? { rotate: [-3, 3, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                  passError
                    ? "bg-rose-900/40 border border-rose-600/40"
                    : "bg-maroon-900/40 border border-maroon-600/30"
                }`}
              >
                <Eye
                  className={`w-7 h-7 transition-colors ${
                    passError ? "text-rose-400" : "text-maroon-400"
                  }`}
                />
              </motion.div>
              <h1 className="text-lg font-black text-white tracking-tight">
                Command Dashboard
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-widest">
                অন্তরীপ ২১ • Restricted Access
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <motion.input
                  animate={passError ? { x: [-8, 8, -8, 8, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  autoFocus
                  type="password"
                  placeholder="Access Token"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value.toUpperCase())}
                  className={`w-full bg-slate-800/60 border rounded-2xl py-4 px-5 text-center text-sm font-black tracking-[0.4em] outline-none transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-600 text-white ${
                    passError
                      ? "border-rose-600/60 ring-4 ring-rose-500/10"
                      : "border-slate-700 focus:border-maroon-500/80 focus:ring-4 focus:ring-maroon-500/10"
                  }`}
                />
                {passError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-widest"
                  >
                    Invalid token
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-maroon-700 to-maroon-600 text-white font-black text-sm py-4 rounded-2xl hover:from-maroon-600 hover:to-maroon-500 transition-all shadow-lg shadow-maroon-900/30 active:scale-[0.98]"
              >
                Authenticate
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                  System Online
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                v2.0
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-maroon-500/30 selection:text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-maroon-900/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -right-[15%] w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[30%] h-[30%] bg-emerald-900/5 rounded-full blur-[100px]" />
      </div>

      {/* New scan flash */}
      <AnimatePresence>
        {newScanFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[200] border-2 border-emerald-500/30 rounded-none"
          />
        )}
      </AnimatePresence>

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-5">
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-maroon-700 to-maroon-900 rounded-xl flex items-center justify-center shadow-lg shadow-maroon-900/40">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  অন্তরীপ{" "}
                  <span className="text-maroon-400">২১</span> Command
                </h1>
                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    isOnline ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {isOnline ? "API Operational" : "Connection Issues"}
                </span>
                <span className="text-slate-700 text-[9px]">•</span>
                <span className="text-[9px] font-bold text-slate-600">
                  Synced {secondsSinceUpdate}s ago
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => {
                setShowSearch(true);
                setTimeout(() => searchRef.current?.focus(), 50);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs font-bold"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 bg-slate-700 rounded text-[9px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Audio toggle */}
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2.5 border rounded-xl transition-all ${
                isAudioEnabled
                  ? "bg-emerald-900/30 border-emerald-700/40 text-emerald-400"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-500"
              }`}
              title={isAudioEnabled ? "Mute alerts" : "Unmute alerts"}
            >
              {isAudioEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all disabled:opacity-40"
              title="Refresh (Ctrl+R)"
            >
              <RefreshCcw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Sign out */}
            <button
              onClick={() => {
                localStorage.removeItem("see_auth_v2");
                setIsAuthenticated(false);
              }}
              className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-500 hover:text-rose-400 hover:border-rose-800/40 transition-all"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ─── Attendance Progress Bar ──────────────────────────────────────── */}
        <div className="mb-6 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Attendance Capacity
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-emerald-400">
                {stats.scansDone} checked in
              </span>
              <span className="text-slate-600 text-[10px]">/</span>
              <span className="text-[11px] font-bold text-slate-400">
                {stats.totalReg} registered
              </span>
              <span className="px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/30 rounded-full text-[10px] font-black text-emerald-400">
                {attendancePct}%
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attendancePct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-maroon-600 via-maroon-500 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
          </div>
        </div>

        {/* ─── KPI Row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            label="Registered"
            value={stats.totalReg}
            icon={Users}
            sub="Total sign-ups"
            delay={0}
          />
          <StatCard
            label="Checked In"
            value={stats.scansDone}
            icon={QrCode}
            sub="On-site now"
            color="green"
            trend="up"
            delay={0.05}
          />
          <StatCard
            label="Male"
            value={stats.maleCount}
            icon={UserCheck}
            sub={`${stats.totalReg > 0 ? ((stats.maleCount / stats.totalReg) * 100).toFixed(0) : 0}% of total`}
            color="blue"
            delay={0.1}
          />
          <StatCard
            label="Female"
            value={stats.femaleCount}
            icon={UserX}
            sub={`${stats.totalReg > 0 ? ((stats.femaleCount / stats.totalReg) * 100).toFixed(0) : 0}% of total`}
            color="orange"
            delay={0.15}
          />
          <StatCard
            label="Flow Rate"
            value={stats.currentVelocity}
            icon={Activity}
            sub="Scans / 15 min"
            color={stats.currentVelocity > 10 ? "green" : "default"}
            trend={stats.currentVelocity > 5 ? "up" : "neutral"}
            delay={0.2}
          />
          <StatCard
            label="Security"
            value={stats.duplicateScans}
            icon={ShieldAlert}
            sub={`Threat: ${stats.duplicateScans > 10 ? "HIGH" : stats.duplicateScans > 5 ? "ELEVATED" : "LOW"}`}
            color={stats.duplicateScans > 5 ? "red" : "default"}
            trend={stats.duplicateScans > 0 ? "up" : "neutral"}
            delay={0.25}
          />
        </div>

        {/* ─── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* ── Left Column ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* University Breakdown */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-3.5 h-3.5 text-maroon-400" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                  University Breakdown
                </h2>
              </div>
              <UniversityBreakdown counts={stats.universityCounts} total={stats.totalReg} />
            </div>

            {/* Blood Group */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                  Blood Groups
                </h2>
              </div>
              <BloodGroupGrid counts={stats.bloodGroupCounts || {}} />
            </div>
          </div>

          {/* ── Center Column ── */}
          <div className="lg:col-span-6 space-y-4">
            {/* Scan Velocity Chart */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                    Hourly Check-in Flow
                  </h2>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Live
                </span>
              </div>
              <div className="h-[140px]">
                <MiniBarChart data={stats.scanHistory || []} />
              </div>
            </div>

            {/* Live Attendance Feed */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                    Live Check-in Feed
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider">
                    Streaming
                  </span>
                </div>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                <LiveFeed
                  scans={stats.recentScans || []}
                  searchTerm={searchTerm}
                />
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Security Watch */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                    Security Watch
                  </h2>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                    (stats.securityAlerts || []).length > 0
                      ? "bg-rose-900/40 border border-rose-700/30 text-rose-400"
                      : "bg-emerald-900/30 border border-emerald-700/20 text-emerald-500"
                  }`}
                >
                  {(stats.securityAlerts || []).length > 0
                    ? `${stats.securityAlerts.length} Alert${stats.securityAlerts.length > 1 ? "s" : ""}`
                    : "Secure"}
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto pr-1">
                <SecurityAlerts alerts={stats.securityAlerts || []} />
              </div>
            </div>

            {/* Scanner Leaderboard */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                  Scanner Leaders
                </h2>
              </div>
              <ScannerBoard counts={stats.scannerCounts || {}} />
            </div>

            {/* System Health */}
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                )}
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                  System Health
                </h2>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "API Status",
                    value: isOnline ? "Operational" : "Error",
                    color: isOnline ? "text-emerald-400" : "text-rose-400",
                  },
                  {
                    label: "Sync Interval",
                    value: "10s",
                    color: "text-slate-300",
                  },
                  {
                    label: "Success Rate",
                    value: `${successRate}%`,
                    color:
                      successRate > 90
                        ? "text-emerald-400"
                        : "text-orange-400",
                  },
                  {
                    label: "Data Source",
                    value: "Sheets API",
                    color: "text-blue-400",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0 last:pb-0"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-black ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-maroon-700/50 rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-maroon-400 rotate-45" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              অন্তরীপ ২১ Command Center • v2.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-700 uppercase">
              BD-PROD
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <span className="text-[9px] font-bold text-slate-700">
              {new Date().toLocaleDateString("en-BD", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </footer>
      </div>

      {/* ─── Search Overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSearch(false);
                setSearchTerm("");
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-slate-800">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name, ticket ID, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm("");
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {searchTerm && (
                <div className="p-2 max-h-64 overflow-y-auto">
                  {stats.recentScans
                    .filter(
                      (s) =>
                        s.fullName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        s.ticketId
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        s.university
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((s) => (
                      <div
                        key={s.ticketId}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-maroon-900/40 border border-maroon-700/30 flex items-center justify-center text-maroon-400 text-[10px] font-black">
                          {s.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {s.fullName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {s.ticketId} • {s.university}
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      </div>
                    ))}
                  {stats.recentScans.filter(
                    (s) =>
                      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.university.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-500">
                        No results for &quot;{searchTerm}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
