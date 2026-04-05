"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  School, 
  UserSquare2, 
  Activity, 
  RefreshCcw, 
  QrCode,
  Zap,
  Droplet,
  Clock,
  MoreVertical,
  ShieldAlert,
  ZapOff,
  Cpu,
  Terminal as TerminalIcon,
  Volume2,
  VolumeX
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

export default function StatsClient({ initialStats }: { initialStats: DashboardStats }) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[SYSTEM] Booting Command Center...", "[INFO] Secure Gate Protocol v4.0.2 Active", "[INFO] Syncing with Google Cloud..."]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  // Security Access State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "EECE20") {
      setIsAuthenticated(true);
      playBeep(880, 0.1);
    } else {
      setPassError(true);
      playBeep(220, 0.2);
      setTimeout(() => setPassError(false), 500);
      setPassInput("");
    }
  };

  // Initialize and preserve AudioContext to prevent latency
  useEffect(() => {
    if (isAudioEnabled && !audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        setAudioContext(new AudioCtx());
      }
    }
  }, [isAudioEnabled, audioContext]);

  // Visual pulse counter
  useEffect(() => {
    const timer = setInterval(() => setSecondsSinceUpdate(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio Beep Logic (Web Audio API)
  const playBeep = React.useCallback((freq = 880, duration = 0.1) => {
    if (!isAudioEnabled || !audioContext) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn("Audio failed:", e);
    }
  }, [audioContext, isAudioEnabled]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
  };

  const refreshData = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      
      // Detection for Beep & Logs
      if (data.scansDone > stats.scansDone) {
        const diff = data.scansDone - stats.scansDone;
        playBeep(880, 0.15); // High pitch for success
        addLog(`SUCCESS: ${diff} new check-in(s) detected.`);
      }
      
      if (data.duplicateScans > stats.duplicateScans) {
        playBeep(220, 0.3); // Low pitch for alert
        addLog(`CRITICAL: Duplicate entry attempt flagged.`);
      }

      setStats(data);
      setSecondsSinceUpdate(0); // Reset visual counter
    } catch (error) {
      addLog("ERROR: Data sync failure. Retrying...");
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [stats.scansDone, stats.duplicateScans, playBeep]); 

  // Auto refresh every 10 seconds for API safety (Google Sheets Rate Limits)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startPolling = () => {
      interval = setInterval(() => {
        // Only refresh if tab is active to save API quota
        if (document.visibilityState === 'visible') {
          refreshData();
        }
      }, 10000);
    };

    startPolling();
    return () => clearInterval(interval);
  }, [refreshData]); 


  const universityEntries = Object.entries(stats.universityCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  const scannerEntries = Object.entries(stats.scannerCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  const bloodGroupEntries = Object.entries(stats.bloodGroupCounts || {})
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  const recentScans = stats.recentScans || [];
  const scanHistory = stats.scanHistory || [];
  const securityAlerts = stats.securityAlerts || [];

  // Filtered stats for local search
  const filteredUnis = universityEntries.filter(([uni]) => 
    uni.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredScans = recentScans.filter((scan: Scan) => 
    scan.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    scan.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("command-search")?.focus();
      }
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        refreshData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [refreshData]);

  const serverIsOnline = stats.serverStatus === "operational";



  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6 font-mono overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Security Decals */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maroon-500/50 to-transparent"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${passError ? 'bg-rose-500/20 text-rose-500 ring-rose-500/30' : 'bg-maroon-500/10 text-maroon-500 ring-maroon-500/20'} ring-8`}>
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1 italic">Security Override</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized Access Only • Clearance Level 4</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <motion.div 
              animate={passError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <input 
                autoFocus
                type="password" 
                placeholder="ENTER SECURITY CODE..."
                value={passInput}
                onChange={(e) => setPassInput(e.target.value.toUpperCase())}
                className={`w-full bg-black/40 border ${passError ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-800 focus:border-maroon-500'} rounded-2xl py-4 px-6 text-center text-sm font-black tracking-[1em] outline-none transition-all placeholder:tracking-widest placeholder:text-slate-700 text-white`}
              />
              {passError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-6 left-0 w-full text-center text-[9px] font-black text-rose-500 uppercase tracking-widest"
                >
                  Invalid Clearance Code
                </motion.p>
              )}
            </motion.div>
            <button 
              type="submit"
              className="w-full bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-2xl hover:bg-maroon-500 hover:text-white transition-all shadow-xl active:scale-[0.98]"
            >
              Unlock Terminal
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-800/50 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse"></div>
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Proxy Active</span>
             </div>
             <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">HQ//SYSLOCK_v4</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-100 font-sans selection:bg-maroon-500 selection:text-white overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-maroon-900/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-orange-900/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative flex-1 flex flex-col max-w-[1600px] mx-auto w-full px-6 py-6 overflow-hidden">
        {/* Compact Header & Search */}
        <header className="flex items-center justify-between gap-6 mb-6 pb-4 border-b border-slate-800/30 flex-shrink-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-maroon-700 rounded-xl flex items-center justify-center shadow-lg shadow-maroon-900/20">
               <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-tight">
                Event<span className="text-maroon-500">Insight</span><span className="text-slate-600 text-xs ml-1 font-bold tracking-tighter">PROTO</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">HQ Terminal</span>
                <div className={`w-1 h-1 rounded-full ${serverIsOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 max-w-md relative group px-10">
            <div className="flex items-center justify-between mb-1.5 px-1">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Capacity</span>
               <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-black text-slate-700">CMD+K TO SEARCH</span>
                  <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                  <span className="text-[8px] font-black text-emerald-500">{((stats.scansDone/stats.totalReg)*100).toFixed(1)}% Filled</span>
               </div>
            </div>
            <div className="relative">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(stats.scansDone/stats.totalReg)*100}%` }}
                   className="h-full bg-gradient-to-r from-maroon-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                 />
              </div>
              {/* Invisible focusable search input */}
              <input 
                id="command-search"
                type="text"
                className="absolute inset-0 opacity-0 pointer-events-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsAudioEnabled(!isAudioEnabled);
                if (!isAudioEnabled) playBeep(440, 0.05);
              }}
              className={`p-2.5 border rounded-xl transition-all ${isAudioEnabled ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'}`}
              title={isAudioEnabled ? "Mute Alerts" : "Unmute Alerts"}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={() => setShowTerminal(!showTerminal)}
              className={`p-2.5 border rounded-xl transition-all ${showTerminal ? 'bg-maroon-500/10 border-maroon-500/50 text-maroon-500 shadow-lg shadow-maroon-500/10' : 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60'}`}
              title="Toggle Terminal"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col items-end px-2">
               <div className="flex items-center gap-1.5 leading-none">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${serverIsOnline ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
                   <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${serverIsOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                 </span>
                 <p className={`text-[9px] font-black ${serverIsOnline ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-widest`}>
                   {serverIsOnline ? 'PULSE STABLE' : 'LINK LOST'}
                 </p>
               </div>
               <div className="flex items-center gap-1.5 mt-1 border-t border-slate-800/50 pt-1">
                  <span className="text-[7px] font-black uppercase text-slate-500 italic">
                    Pulse: {secondsSinceUpdate}s ago
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                  <span className={`text-[7px] font-black uppercase ${stats.duplicateScans > 10 ? 'text-rose-500' : stats.duplicateScans > 5 ? 'text-orange-500' : 'text-slate-500'}`}>
                    Threat: {stats.duplicateScans > 10 ? 'HIGH' : stats.duplicateScans > 5 ? 'ELEVATED' : 'LOW'}
                  </span>
               </div>
            </div>
            <button 
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-2.5 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-maroon-500/50 text-slate-400 transition-all disabled:opacity-30"
              title="Manual Sync (Cmd+R)"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Compact KPI Row */}
        <div className="grid grid-cols-5 gap-3 mb-6 flex-shrink-0">
            {[
              { label: "Guest List", value: stats.totalReg, icon: Users, color: "slate" },
              { label: "On-Site", value: stats.scansDone, icon: QrCode, color: "emerald", extra: "confirmed" },
              { label: "Flow Rate", value: stats.currentVelocity, icon: Activity, color: "orange", extra: "scans/15m" },
              { label: "Efficiency", value: `${Math.round((stats.scansDone / (stats.scansDone + stats.duplicateScans || 1)) * 100)}%`, icon: Zap, color: "blue", extra: "success rate" },
              { label: "Security", value: stats.duplicateScans, icon: ShieldAlert, color: "rose", extra: "flags" }
            ].map((kpi, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800 flex items-center justify-between group hover:border-slate-700/50 transition-all"
             >
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{kpi.label}</p>
                  <div className="flex items-baseline gap-1.5 leading-none">
                    <p className="text-lg font-black text-white">{kpi.value}</p>
                    {kpi.extra && <span className="text-[8px] font-black text-slate-400/50">{kpi.extra}</span>}
                  </div>
               </div>
               <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-500/5 border border-${kpi.color}-500/10 flex items-center justify-center`}>
                  <kpi.icon className={`w-3.5 h-3.5 text-${kpi.color}-500/80`} />
               </div>
             </motion.div>
           ))}
        </div>

        {/* 3-Column Grid Layout - SCALED TO FILL HEIGHT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden min-h-0">
          
          {/* Left Column: Logistics */}
          <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
            <motion.div initial="hidden" animate="visible" className="flex-1 min-h-0 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col">
              <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 flex-shrink-0">
                <School className="w-3 h-3 text-maroon-500" /> University Board
              </h3>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                {filteredUnis.map(([uni, count]) => (
                  <div key={uni} className="flex items-center justify-between group">
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-black text-slate-200 truncate max-w-[140px]">{uni}</span>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-maroon-500/50 rounded-full" style={{ width: `${(count/stats.totalReg)*100}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-maroon-400 ml-3">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="h-1/2 flex flex-col gap-4">
              <motion.div className="flex-1 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col">
                 <h3 className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2 flex-shrink-0">
                  <Droplet className="w-3 h-3" /> Blood Mix
                </h3>
                <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar">
                  {bloodGroupEntries.slice(0, 8).map(([bg, count]) => (
                    <div key={bg} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between px-3">
                      <span className="text-[8px] font-black text-rose-400 uppercase">{bg}</span>
                      <span className="text-[11px] font-black text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="flex-1 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col">
                 <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2 flex-shrink-0">
                  <UserSquare2 className="w-3 h-3 text-orange-400" /> Scanner Force
                </h3>
                <div className="space-y-2 overflow-y-auto pr-1">
                 {scannerEntries.slice(0, 5).map(([name, count], idx) => (
                   <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center text-[8px] font-black text-orange-400 border border-orange-500/20">
                            {idx + 1}
                         </div>
                         <p className="text-[9px] font-black text-slate-300 truncate max-w-[80px]">{name}</p>
                      </div>
                      <span className="text-[9px] font-black text-orange-400 bg-orange-500/10 px-1.5 rounded">{count}</span>
                   </div>
                 ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Center Column: Live Pulse & Stream */}
          <div className="lg:col-span-6 space-y-4 flex flex-col h-full">
            <motion.div className="h-2/5 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col">
               <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Velocity Tracking
                </h3>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">REAL-TIME FLOW</span>
              </div>
              <div className="flex-1 flex items-end gap-1 px-1 min-h-0">
                {scanHistory.map((item: HistoryPoint, idx: number) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.count / (Math.max(...scanHistory.map((h: HistoryPoint) => h.count)) || 1)) * 100}%` }}
                      className="w-full bg-emerald-500/10 group-hover:bg-emerald-500/30 border-t-2 border-emerald-500 rounded-sm transition-all min-h-[1px]"
                    />
                    <span className="text-[7px] font-black text-slate-600 group-hover:text-slate-400">{item.time.split(':')[0]}h</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="flex-1 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 overflow-hidden flex flex-col">
               <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-emerald-400" /> Attendance Feed
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></div>
                   <span className="text-[7px] font-black text-emerald-500 tracking-[0.2em] uppercase">Stream Active</span>
                </div>
              </h3>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredScans.slice(0, 15).map((scan: Scan) => (
                    <motion.div 
                      key={scan.ticketId}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-all px-4"
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[9px] font-black text-emerald-500 border border-emerald-500/10 uppercase">
                           {scan.fullName.charAt(0)}
                         </div>
                         <div className="leading-tight">
                            <p className="text-[10px] font-black text-slate-200">{scan.fullName}</p>
                            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">{scan.university}</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-end leading-none">
                        <span className="text-[9px] font-black text-slate-400">
                          {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-[3px] mt-1 text-emerald-500/50 uppercase font-black tracking-widest leading-none">CHECK-IN CONFIRMED</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredScans.length === 0 && (
                  <div className="h-full flex items-center justify-center flex-col opacity-20">
                    <ZapOff className="w-8 h-8 mb-4" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Stream Data</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Personnel & Meta */}
          <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
            <motion.div className="flex-1 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col min-h-0">
               <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-orange-400" /> Security Watch
                </div>
                <div className={`p-1 px-2 rounded-full text-[7px] font-black ${securityAlerts.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {securityAlerts.length > 0 ? 'ALERTS FOUND' : 'SECURE'}
                </div>
              </h3>
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {securityAlerts.length > 0 ? securityAlerts.map((alert: Alert, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 leading-tight">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-black text-orange-400 uppercase tracking-tight">{alert.type} FLAG</span>
                        <span className="text-[7px] font-bold text-slate-600">{new Date(alert.timestamp).toLocaleTimeString([], { second: 'numeric' })}</span>
                     </div>
                     <p className="text-[9px] font-bold text-slate-300">ID: {alert.ticketId}</p>
                     <p className="text-[8px] text-slate-500 truncate leading-none mt-1 uppercase">{alert.details}</p>
                  </div>
                )) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-slate-800 rounded-3xl p-6 text-center">
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">System monitoring active.<br/>No security flags raised.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div className="h-1/3 p-5 rounded-3xl bg-slate-900/30 border border-slate-800 flex flex-col flex-shrink-0">
               <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <Cpu className="w-3 h-3 text-blue-400" /> Operational Health
              </h3>
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                {[
                  { label: "Sync Latency", value: "Locked", status: "optimal" },
                  { label: "API Stream", value: "3.0s/tick", status: "optimal" },
                  { label: "Security", value: "v4.0.2", status: "active" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-800/30 pb-1.5 last:border-0 last:pb-0">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-300">{item.value}</span>
                        <div className={`w-1 h-1 rounded-full ${item.status === 'optimal' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                     </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Matrix Terminal Suggestion #4 - ABSOLUTE OVERLAY TO SAVE SPACE */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-10 right-10 w-96 border border-slate-700 bg-black/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black z-50 overflow-hidden"
            >
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Debug.Log Console</span>
                <button onClick={() => setShowTerminal(false)} className="text-[8px] font-black text-rose-500 hover:text-rose-400 uppercase">Close</button>
              </div>
              <div className="p-4 h-56 overflow-y-auto font-mono text-[9px] leading-tight custom-scrollbar">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`mb-1 ${log.includes("SUCCESS") ? "text-emerald-500" : log.includes("CRITICAL") ? "text-rose-500" : "text-slate-500"}`}>
                    <span className="opacity-30 mr-2 whitespace-nowrap">{terminalLogs.length - i}</span>
                    {log}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Modal Overlay (Centered and Clean) */}
        <AnimatePresence>
          {searchTerm && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-none"
            >
               <div className="bg-slate-900/90 border border-maroon-500/30 rounded-3xl p-4 shadow-2xl pointer-events-auto">
                  <p className="text-[8px] font-black text-maroon-500 uppercase tracking-widest text-center">Global Filter Active: &quot;{searchTerm}&quot;</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer (Condensed) */}
        <footer className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between flex-shrink-0">
           <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-maroon-500 rotate-45 rounded-sm"></div>
                 <p className="text-[10px] font-black text-white tracking-widest uppercase">ANTORIP&apos;21</p>
              </div>
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em] border-l border-slate-800 pl-5">Command Station v1.2.0</p>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1 justify-end">
                   Deployment Region: <span className="text-slate-300">BD-PROD</span>
                </p>
              </div>
              <div className="p-1.5 rounded-full border border-slate-800 text-slate-700 hover:text-white transition-colors cursor-pointer">
                 <MoreVertical className="w-3 h-3" />
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
