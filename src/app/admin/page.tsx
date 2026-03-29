"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Users, UserCheck, UserX, Download, Search, 
  ArrowUpDown, Loader2, Ticket, GraduationCap, Droplets
} from "lucide-react";
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
  status: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "admin") {
        setLoading(false);
        return;
      }
      fetchData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
      setStats(data);
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
        t.fullName.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.university.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(search.toLowerCase());
      const matchesGender = genderFilter === "all" || t.gender === genderFilter;
      return matchesSearch && matchesGender;
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
    const headers = ["Ticket ID", "Full Name", "Email", "Phone", "Student ID", "University", "Gender", "Blood Group", "Status", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...filteredTickets.map(t => [
        t.ticketId, t.fullName, t.email, t.phone, t.studentId, 
        t.university, t.gender, t.bloodGroup, t.status, t.timestamp
      ].map(v => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tickets-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-offwhite">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-offwhite">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="card-premium p-10 text-center max-w-md">
            <h2 className="text-2xl font-black text-maroon-950 mb-4">Admin Access</h2>
            <p className="text-slate-400 mb-6">Please sign in to access the admin dashboard.</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="btn-primary px-8 py-3 rounded-xl"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
    return (
      <main className="min-h-screen bg-offwhite">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="card-premium p-10 text-center max-w-md">
            <h2 className="text-2xl font-black text-maroon-950 mb-4">Access Denied</h2>
            <p className="text-slate-400 mb-6">You do not have permission to access the admin dashboard.</p>
            <button
              onClick={() => signOut()}
              className="btn-primary px-8 py-3 rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-12 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-3xl md:text-4xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-maroon-200 font-medium">Manage and monitor event registrations</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</p>
                <p className="text-3xl font-black text-maroon-900 mt-1">{stats?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-maroon-700/10 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-maroon-700" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Male</p>
                <p className="text-3xl font-black text-blue-600 mt-1">{stats?.male || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Female</p>
                <p className="text-3xl font-black text-pink-600 mt-1">{stats?.female || 0}</p>
              </div>
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other</p>
                <p className="text-3xl font-black text-purple-600 mt-1">{stats?.other || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8"
        >
          <h3 className="font-black text-maroon-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Registrations by University
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats?.stats?.byUniversity || {}).map(([uni, count]: [string, any]) => (
              <div key={uni} className="px-4 py-2 bg-slate-100 rounded-xl flex items-center gap-2">
                <span className="font-bold text-maroon-900">{uni}</span>
                <span className="text-slate-500 text-sm">({count})</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, university..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-maroon-700 w-64"
                />
              </div>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-maroon-700"
              >
                <option value="all">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-maroon-700 text-white rounded-xl text-sm font-bold hover:bg-maroon-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort("fullName")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Name
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort("email")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Email
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort("university")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      University
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort("gender")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Gender
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>

                  <th className="px-6 py-4 text-left">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Droplets className="w-3 h-3" />
                      Blood
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button 
                      onClick={() => handleSort("timestamp")}
                      className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-maroon-700"
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket, i) => (
                    <motion.tr
                      key={ticket.ticketId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-maroon-900">{ticket.fullName}</p>
                          <p className="text-xs text-slate-400">{ticket.ticketId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{ticket.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-maroon-700/10 text-maroon-700 rounded-lg text-xs font-bold">
                          {ticket.university}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          ticket.gender === "Male" ? "bg-blue-50 text-blue-600" :
                          ticket.gender === "Female" ? "bg-pink-50 text-pink-600" :
                          "bg-purple-50 text-purple-600"
                        }`}>
                          {ticket.gender}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-red-600">{ticket.bloodGroup}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-400">
                          {new Date(ticket.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
            <p className="text-sm text-slate-500 font-medium">
              Showing {filteredTickets.length} of {tickets.length} registrations
            </p>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-slate-200 py-8 bg-white mt-12">
        <p className="text-center text-xs text-slate-400 font-semibold tracking-wider">
          OmniTick · Admin Panel · © 2026
        </p>
      </div>
    </main>
  );
}
