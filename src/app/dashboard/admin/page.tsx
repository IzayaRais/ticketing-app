"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserCheck, UserX, Download, Search, 
  Filter, ArrowUpDown, Loader2, Ticket, 
  GraduationCap, Shirt, Droplets, Lock, Mail, Key,
  ChevronRight, LogOut, ShieldCheck
} from "lucide-react";
import Navbar from "@/components/Navbar";

type SortField = "fullName" | "email" | "university" | "timestamp" | "gender";
type SortOrder = "asc" | "desc";

interface Attendee {
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  university: string;
  gender: string;
  tshirtSize: string;
  bloodGroup: string;
  status: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tickets, setTickets] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [stats, setStats] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "admin@antorip.com" && loginPass === "antorip123") {
      setIsAuthenticated(true);
      setLoginError("");
      fetchData();
    } else {
      setLoginError("Invalid administrative credentials. Access Denied.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/attendees?email=admin@antorip.com&pass=antorip123`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTickets(data.attendees || []);
      
      // Calculate basic stats
      const male = data.attendees.filter((t: any) => t.gender === "Male").length;
      const female = data.attendees.filter((t: any) => t.gender === "Female").length;
      setStats({
        total: data.attendees.length,
        male,
        female,
        other: data.attendees.length - male - female
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
        t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.university?.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId?.toLowerCase().includes(search.toLowerCase());
      const matchesGender = genderFilter === "all" || t.gender === genderFilter;
      return matchesSearch && matchesGender;
    })
    .sort((a, b) => {
      let aVal: string | number = a[sortField] || "";
      let bVal: string | number = b[sortField] || "";
      if (sortField === "timestamp") {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const downloadCSV = () => {
    const headers = ["Ticket ID", "Full Name", "Email", "Phone", "Student ID", "University", "Gender", "T-Shirt", "Blood Group", "Status", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...filteredTickets.map(t => [
        t.ticketId, t.fullName, t.email, t.phone, t.studentId, 
        t.university, t.gender, t.tshirtSize, t.bloodGroup, t.status, t.timestamp
      ].map(v => `"${v || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `antorip-attendees-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-maroon-900 p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
                  <Lock className="w-10 h-10 text-white" />
               </div>
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Gateway</h2>
               <p className="text-maroon-200 text-sm font-bold mt-2 tracking-widest uppercase">Administrative Clearance Required</p>
            </div>

            <form onSubmit={handleLogin} className="p-12 space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-maroon-700/30 transition-all font-bold text-slate-800"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Access Passphrase</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-maroon-700/30 transition-all font-bold text-slate-800"
                    />
                  </div>
               </div>

               {loginError && (
                 <motion.p 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-red-500 text-xs font-black text-center uppercase tracking-tighter"
                 >
                   {loginError}
                 </motion.p>
               )}

               <button 
                type="submit"
                className="btn-primary w-full py-5 rounded-2xl bg-maroon-900 border-none shadow-xl shadow-maroon-900/20 active:scale-[0.98] group"
               >
                  <span className="font-black uppercase tracking-widest">Verify & Enter</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </form>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-6 h-6 text-maroon-700" />
                 <span className="text-[10px] font-black text-maroon-700 uppercase tracking-[0.4em]">Administrative Access</span>
              </div>
              <h1 className="text-5xl font-black text-maroon-950 tracking-tighter leading-none uppercase">Attendee Management</h1>
              <p className="text-slate-500 font-bold text-lg mt-3 tracking-tight">Monitoring real-time registrations for Antorip Farewell 2026.</p>
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
            >
               <LogOut className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-black text-slate-900 uppercase">Exit Terminal</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             {[
               { label: "Total Recruits", value: stats?.total || 0, icon: <Users />, color: "text-maroon-700" },
               { label: "Male Attendees", value: stats?.male || 0, icon: <UserCheck />, color: "text-blue-600" },
               { label: "Female Attendees", value: stats?.female || 0, icon: <UserX />, color: "text-pink-600" }
             ].map((stat, i) => (
               <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                     <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} opacity-40`}>
                     {stat.icon}
                  </div>
               </div>
             ))}
          </div>

          {/* Data Table Container */}
          <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden">
             {/* Toolbar */}
             <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="relative w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                   <input 
                    type="text"
                    placeholder="Search by ID, Name or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:border-maroon-700/30 transition-all font-bold text-slate-800 text-sm"
                   />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                   <select 
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="flex-1 md:flex-none px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none"
                   >
                      <option value="all">Gender: All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                   </select>
                   <button 
                    onClick={downloadCSV}
                    className="px-8 py-4 bg-slate-900 text-white rounded-[20px] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 active:scale-95 transition-all"
                   >
                      <Download className="w-4 h-4" />
                      Export Data
                   </button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50">
                         {["Name & ID", "Institution", "Identity", "Gear & Health", "Registered"].map((h, i) => (
                           <th key={i} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{h}</th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr>
                           <td colSpan={5} className="py-24 text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                           </td>
                        </tr>
                      ) : filteredTickets.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found.</td>
                        </tr>
                      ) : (
                        filteredTickets.map((row, i) => (
                          <motion.tr 
                            key={row.ticketId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group hover:bg-slate-50/80 transition-colors"
                          >
                             <td className="px-10 py-8">
                                <p className="font-black text-maroon-950 uppercase tracking-tight text-sm mb-1">{row.fullName}</p>
                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{row.ticketId} • {row.studentId}</p>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-xs font-black text-slate-600 uppercase mb-1">{row.university}</p>
                                <p className="text-[10px] font-semibold text-slate-400">{row.email}</p>
                             </td>
                             <td className="px-10 py-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  row.gender === "Male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                                }`}>
                                   {row.gender}
                                </span>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-1.5">
                                      <Shirt className="w-3 h-3 text-slate-300" />
                                      <span className="text-xs font-black text-slate-700">{row.tshirtSize}</span>
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <Droplets className="w-3 h-3 text-red-400" />
                                      <span className="text-xs font-black text-red-700">{row.bloodGroup}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[10px] font-black text-slate-500 uppercase">
                                   {new Date(row.timestamp).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}
                                </p>
                             </td>
                          </motion.tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
             <div className="p-8 bg-slate-50/50 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Antorip Administrative System · 0.9.4.26</p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
