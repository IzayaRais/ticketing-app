"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserCheck, UserX, Download, Search, 
  ArrowUpDown, Ticket, GraduationCap, Droplets,
  ChevronDown, Shield, LogOut, Filter, RefreshCw, QrCode, CheckCircle2, Clock, Power, Settings
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type SortField = "fullName" | "email" | "university" | "timestamp" | "gender";
type SortOrder = "asc" | "desc";

interface Ticket {
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  university: string;
  gender: string;
  bloodGroup: string;
  paymentMethod: string;
  transactionId: string;
  paymentNumber: string;
  paymentFromNumber: string;
  status: string;
  timestamp: string;
  checkedIn: string;
  checkedInAt: string;
  scannedBy: string;
}

interface ScannerUser {
  name: string;
  email: string;
  createdAt: string;
  createdBy: string;
  active: string;
}

interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
}

interface LiveActivityItem {
  id: string;
  type: "registration" | "scan";
  ticketId: string;
  fullName: string;
  at: string;
  scannedBy?: string;
}

const universities = ["MIST", "BUP", "AFMC"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [scanStatusFilter, setScanStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<{ total: number; male: number; female: number; other: number; scanned: number; notScanned: number; stats: { byUniversity: Record<string, number>; byBloodGroup: Record<string, number> } } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [scannerUsers, setScannerUsers] = useState<ScannerUser[]>([]);
  const [scannerName, setScannerName] = useState("");
  const [scannerEmail, setScannerEmail] = useState("");
  const [scannerPassword, setScannerPassword] = useState("");
  const [scannerMessage, setScannerMessage] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivityItem[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const previousSnapshotRef = useRef<Map<string, { checkedIn: string }>>(new Map());
  const initializedRef = useRef(false);
  const [appConfig, setAppConfig] = useState<{ registrationEnabled: boolean; pauseUntil: string | null } | null>(null);
  const [configLoading, setConfigLoading] = useState(false);

  useEffect(() => {
    let count = 0;
    if (genderFilter !== "all") count++;
    if (universityFilter !== "all") count++;
    if (bloodGroupFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    if (scanStatusFilter !== "all") count++;
    setActiveFilterCount(count);
  }, [genderFilter, universityFilter, bloodGroupFilter, dateFilter, scanStatusFilter]);

  const clearAllFilters = () => {
    setGenderFilter("all");
    setUniversityFilter("all");
    setBloodGroupFilter("all");
    setDateFilter("all");
    setScanStatusFilter("all");
    setSearch("");
  };

  const normalizeEventDate = (value?: string) => {
    if (!value) return new Date();
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };

  const processLiveData = useCallback((incoming: Ticket[]) => {
    const snapshot = new Map<string, { checkedIn: string }>();
    const newNotifications: NotificationItem[] = [];

    for (const t of incoming) {
      snapshot.set(t.ticketId, { checkedIn: t.checkedIn });
      const prev = previousSnapshotRef.current.get(t.ticketId);

      if (!initializedRef.current) continue;

      if (!prev) {
        newNotifications.push({
          id: `reg-${t.ticketId}-${Date.now()}`,
          message: `New registration: ${t.fullName} (${t.ticketId})`,
          createdAt: new Date().toISOString(),
        });
      } else if (prev.checkedIn !== "true" && t.checkedIn === "true") {
        newNotifications.push({
          id: `scan-${t.ticketId}-${Date.now()}`,
          message: `Ticket scanned: ${t.fullName} (${t.ticketId}) by ${t.scannedBy || "Unknown"}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const allActivities: LiveActivityItem[] = [];
    for (const t of incoming) {
      allActivities.push({
        id: `reg-${t.ticketId}`,
        type: "registration",
        ticketId: t.ticketId,
        fullName: t.fullName,
        at: t.timestamp,
      });
      if (t.checkedIn === "true") {
        allActivities.push({
          id: `scan-${t.ticketId}`,
          type: "scan",
          ticketId: t.ticketId,
          fullName: t.fullName,
          at: t.checkedInAt || t.timestamp,
          scannedBy: t.scannedBy,
        });
      }
    }

    allActivities.sort((a, b) => normalizeEventDate(b.at).getTime() - normalizeEventDate(a.at).getTime());
    setLiveActivities(allActivities.slice(0, 20));

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 10));
    }

    previousSnapshotRef.current = snapshot;
    initializedRef.current = true;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tickets", { cache: "no-store" });
      const data = await res.json();
      const incomingTickets = data.tickets || [];
      setTickets(incomingTickets);
      setStats(data);
      processLiveData(incomingTickets);
      setLastSyncedAt(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [processLiveData]);

  const fetchScannerUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scanner-users", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setScannerUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching scanner users:", error);
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/config", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setAppConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }, []);

  const handleToggleRegistration = async () => {
    if (!appConfig) return;
    setConfigLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationEnabled: !appConfig.registrationEnabled }),
      });
      const data = await res.json();
      if (res.ok) setAppConfig(data);
    } catch (error) {
      console.error("Error toggling registration:", error);
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user?.role;
      if (userRole !== "admin") {
        setLoading(false);
        return;
      }
      fetchData();
      fetchScannerUsers();
      fetchConfig();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, fetchData, fetchScannerUsers, fetchConfig]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;
    const interval = setInterval(() => {
      fetchData();
    }, 8000);
    return () => clearInterval(interval);
  }, [status, session, fetchData]);

  const handleCreateScanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setScannerMessage("");
    try {
      const res = await fetch("/api/admin/scanner-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: scannerName, email: scannerEmail, password: scannerPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setScannerMessage(data.message || "Failed to save scanner user.");
        return;
      }
      setScannerMessage(data.message || "Scanner user saved successfully.");
      setScannerName("");
      setScannerEmail("");
      setScannerPassword("");
      fetchScannerUsers();
    } catch {
      setScannerMessage("Failed to save scanner user.");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredTickets = tickets
    .filter((t) => {
      const matchesSearch = 
        t.fullName.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.university.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        t.studentId.toLowerCase().includes(search.toLowerCase()) ||
        (t.paymentMethod || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.transactionId || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.paymentFromNumber || "").toLowerCase().includes(search.toLowerCase());
      const matchesGender = genderFilter === "all" || t.gender === genderFilter;
      const matchesUniversity = universityFilter === "all" || t.university === universityFilter;
      const matchesBloodGroup = bloodGroupFilter === "all" || t.bloodGroup === bloodGroupFilter;
      
      const isScanned = t.checkedIn === "true";
      const matchesScanStatus = scanStatusFilter === "all" || 
        (scanStatusFilter === "scanned" && isScanned) || 
        (scanStatusFilter === "notScanned" && !isScanned);
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const ticketDate = new Date(t.timestamp);
        const now = new Date();
        if (dateFilter === "today") {
          matchesDate = ticketDate.toDateString() === now.toDateString();
        } else if (dateFilter === "yesterday") {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = ticketDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = ticketDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = ticketDate >= monthAgo;
        }
      }
      
      return matchesSearch && matchesGender && matchesUniversity && matchesBloodGroup && matchesDate && matchesScanStatus;
    })
    .sort((a, b) => {
      let aVal: string | number = a[sortField] as string;
      let bVal: string | number = b[sortField] as string;
      if (sortField === "timestamp") {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const downloadCSV = () => {
    const headers = ["Ticket ID", "Full Name", "Email", "Phone", "Student ID", "University", "Gender", "Blood Group", "Payment Method", "Transaction ID", "Payment Number", "Payment From Number", "Status", "Timestamp", "Scanned", "Checked In At", "Scanned By"];
    const csvContent = [
      headers.join(","),
      ...filteredTickets.map(t => [
        t.ticketId, t.fullName, t.email, t.phone, t.studentId, 
        t.university, t.gender, t.bloodGroup, t.paymentMethod || "", t.transactionId || "", t.paymentNumber || "", t.paymentFromNumber || "", t.status, t.timestamp, t.checkedIn, t.checkedInAt, t.scannedBy || ""
      ].map(v => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tickets-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const statCards: StatCard[] = [
    { 
      label: "Total Registrations", 
      value: stats?.total || 0, 
      icon: <Ticket className="w-6 h-6" />, 
      color: "text-maroon-700",
      bgColor: "bg-maroon-700/10"
    },
    { 
      label: "Scanned In", 
      value: stats?.scanned || 0, 
      icon: <UserCheck className="w-6 h-6" />, 
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Not Yet Scanned", 
      value: stats?.notScanned || 0, 
      icon: <Users className="w-6 h-6" />, 
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      label: "Male", 
      value: stats?.male || 0, 
      icon: <UserCheck className="w-6 h-6" />, 
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Female", 
      value: stats?.female || 0, 
      icon: <UserX className="w-6 h-6" />, 
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
  ];

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className={`inline-flex items-center ml-1 ${sortField === field ? 'text-maroon-700' : 'text-slate-300'}`}>
      <ArrowUpDown className="w-3 h-3" />
    </span>
  );

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-maroon-100 border-t-maroon-700 rounded-full animate-spin"></div>
              <Shield className="w-6 h-6 text-maroon-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-500 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-maroon-600 to-maroon-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-maroon-700/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Access</h2>
            <p className="text-slate-400 mb-8">Sign in to manage event registrations</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full py-4 px-6 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-xl font-bold hover:from-maroon-800 hover:to-maroon-900 transition-all shadow-lg shadow-maroon-700/30 flex items-center justify-center gap-3"
            >
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center max-w-md w-full"
          >
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-2 font-medium">
              {session?.user?.email}
            </p>
            <p className="text-slate-400 mb-8">              You don&apos;t have permission to access this area</p>
            <div className="flex gap-3 justify-center">
                <Link 
                  href="/" 
                  className="px-6 py-3 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Go Home
                </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-6 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Admin Dashboard</h1>
              <p className="text-slate-400 font-medium mt-1">Manage and monitor event registrations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3">
                <img 
                  src={session?.user?.image || `https://ui-avatars.com/api/?name=Admin&background=maroon-700&color=fff`} 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-bold">{session?.user?.name}</p>
                  <p className="text-slate-400 text-xs">Administrator</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 md:p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black text-slate-800 mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-maroon-700" />
                <h3 className="font-black text-slate-800">Registration Control</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Enable or disable the registration form globally. When disabled, users will see a "Registration Closed" message.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${appConfig?.registrationEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <Power className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Registration Status</p>
                  <p className="text-xs text-slate-500">{appConfig?.registrationEnabled ? 'Currently Active' : 'Currently Paused'}</p>
                </div>
              </div>
              
              <button
                onClick={handleToggleRegistration}
                disabled={configLoading || !appConfig}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                   appConfig?.registrationEnabled ? 'bg-green-600' : 'bg-slate-300'
                } ${configLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    appConfig?.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100"
          >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-black text-slate-800">Live Activity</h3>
              <p className="text-xs text-slate-500">New registrations and scan events appear here. Use refresh anytime for instant sync.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifications([])}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear Notifications
              </button>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="space-y-2 mb-4">
              {notifications.map((n) => (
                <div key={n.id} className="px-3 py-2 rounded-xl bg-maroon-50 border border-maroon-100 text-sm text-maroon-800 font-medium">
                  {n.message}
                </div>
              ))}
            </div>
          )}

          <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-xl">
            {liveActivities.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">No live activity yet.</p>
            ) : (
              liveActivities.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b border-slate-50 last:border-b-0 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.type === "scan" ? "Scanned" : "Registered"}: {item.fullName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.ticketId}
                      {item.type === "scan" && item.scannedBy ? ` • by ${item.scannedBy}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 whitespace-nowrap">
                    {normalizeEventDate(item.at).toLocaleString("en-GB")}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-maroon-700" />
            <h3 className="font-black text-slate-800">Registrations by University</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats?.stats?.byUniversity || {}).length === 0 ? (
              <p className="text-slate-400 text-sm">No university data available</p>
            ) : (
              Object.entries(stats?.stats?.byUniversity || {}).map(([uni, count]) => (
                <div 
                  key={uni} 
                  className="px-3 py-1.5 bg-gradient-to-r from-maroon-50 to-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className="font-bold text-slate-700 text-sm">{uni}</span>
                  <span className="text-slate-400 text-xs">{count}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="p-4 md:p-5 border-b border-slate-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, university, ticket ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-maroon-700 focus:ring-2 focus:ring-maroon-700/10 transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all relative ${
                    showFilters || activeFilterCount > 0
                      ? "border-maroon-700 bg-maroon-50 text-maroon-700" 
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-maroon-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    fetchData();
                    fetchScannerUsers();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <Link
                  href="/scan"
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Scan Tickets</span>
                </Link>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-xl text-sm font-bold hover:from-maroon-800 hover:to-maroon-900 transition-all shadow-lg shadow-maroon-700/20"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Live sync with Sheets {lastSyncedAt ? `• last synced ${new Date(lastSyncedAt).toLocaleTimeString("en-GB")}` : ""}
              </p>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pb-3 space-y-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500 font-medium py-1">Gender:</span>
                        {["all", "Male", "Female"].map((gender) => (
                          <button
                            key={gender}
                            onClick={() => setGenderFilter(gender)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              genderFilter === gender
                                ? "bg-maroon-700 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {gender === "all" ? "All" : gender}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500 font-medium py-1">University:</span>
                        <select
                          value={universityFilter}
                          onChange={(e) => setUniversityFilter(e.target.value)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 focus:outline-none focus:border-maroon-700 bg-white"
                        >
                          <option value="all">All Universities</option>
                          {universities.map((uni) => (
                            <option key={uni} value={uni}>{uni}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500 font-medium py-1">Blood Group:</span>
                        <select
                          value={bloodGroupFilter}
                          onChange={(e) => setBloodGroupFilter(e.target.value)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 focus:outline-none focus:border-maroon-700 bg-white"
                        >
                          <option value="all">All Blood Groups</option>
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500 font-medium py-1">Date:</span>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 focus:outline-none focus:border-maroon-700 bg-white"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="yesterday">Yesterday</option>
                          <option value="week">Last 7 Days</option>
                          <option value="month">Last 30 Days</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500 font-medium py-1">Scan Status:</span>
                        {["all", "scanned", "notScanned"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setScanStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              scanStatusFilter === status
                                ? "bg-maroon-700 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {status === "all" ? "All" : status === "scanned" ? "✓ Scanned" : "○ Not Scanned"}
                          </button>
                        ))}
                      </div>
                      
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-maroon-700 font-medium hover:underline"
                        >
                          Clear all filters ({activeFilterCount} active)
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort("fullName")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Name
                      <SortIcon field="fullName" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    <button 
                      onClick={() => handleSort("email")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Email
                      <SortIcon field="email" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort("university")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      University
                      <SortIcon field="university" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort("gender")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Gender
                      <SortIcon field="gender" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Droplets className="w-3 h-3" />
                      Blood
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left hidden xl:table-cell">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Payment
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left hidden xl:table-cell">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Txn ID
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort("timestamp")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Date
                      <SortIcon field="timestamp" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-400 font-medium">No registrations found</p>
                        <p className="text-slate-300 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket, i) => (
                    <motion.tr
                      key={ticket.ticketId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-maroon-700 transition-colors">{ticket.fullName}</p>
                          <p className="text-xs text-slate-400 font-mono">{ticket.ticketId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-slate-600 truncate max-w-[200px]">{ticket.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-maroon-50 to-slate-50 text-maroon-700 rounded-lg text-xs font-bold border border-maroon-100">
                          {ticket.university}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          ticket.gender === "Male" ? "bg-blue-50 text-blue-600" :
                          ticket.gender === "Female" ? "bg-pink-50 text-pink-600" :
                          "bg-purple-50 text-purple-600"
                        }`}>
                          {ticket.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm font-bold text-red-600">{ticket.bloodGroup}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {ticket.paymentMethod ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                            {ticket.paymentMethod}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {ticket.transactionId ? (
                          <div className="space-y-1">
                            <p className="font-mono text-xs font-bold text-slate-700">{ticket.transactionId}</p>
                            {ticket.paymentFromNumber ? (
                              <p className="text-[11px] text-slate-500">From: {ticket.paymentFromNumber}</p>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">N/A</span>
                        )}
                      </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-400">
                      {new Date(ticket.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {ticket.checkedIn === "true" ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Scanned
                        </span>
                        <p className="text-[11px] text-slate-500">{ticket.scannedBy || "Unknown"}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-800 font-bold">{filteredTickets.length}</span> of <span className="text-slate-800 font-bold">{tickets.length}</span> registrations
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 mb-6"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-black text-slate-800">Scanner Users</h3>
              <p className="text-xs text-slate-500">Create extra scanning accounts (email + password).</p>
            </div>
            <Link href="/scan/login" className="text-xs font-bold text-maroon-700 hover:underline">Open Scanner Login</Link>
          </div>

          <form onSubmit={handleCreateScanner} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              value={scannerName}
              onChange={(e) => setScannerName(e.target.value)}
              placeholder="Full name"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              required
            />
            <input
              type="email"
              value={scannerEmail}
              onChange={(e) => setScannerEmail(e.target.value)}
              placeholder="scanner@email.com"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              required
            />
            <input
              type="password"
              value={scannerPassword}
              onChange={(e) => setScannerPassword(e.target.value)}
              placeholder="Password (min 6)"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              required
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-maroon-700 text-white text-sm font-bold hover:bg-maroon-800"
            >
              Save Scanner User
            </button>
          </form>

          {scannerMessage && <p className="text-xs font-medium text-slate-600 mb-3">{scannerMessage}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Email</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Created By</th>
                  <th className="py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {scannerUsers.map((u) => (
                  <tr key={u.email} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-slate-700">{u.email}</td>
                    <td className="py-2 text-slate-700">{u.name || "-"}</td>
                    <td className="py-2 text-slate-600">{u.createdBy || "-"}</td>
                    <td className="py-2 text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleString("en-GB") : "-"}</td>
                  </tr>
                ))}
                {scannerUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-3 text-slate-400">No scanner users yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-slate-200 py-6 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-semibold tracking-wider">
            OmniTick Admin Panel
          </p>
          <p className="text-xs text-slate-400 font-semibold tracking-wider">
            © 2026 All Rights Reserved
          </p>
        </div>
      </div>
    </main>
  );
}
