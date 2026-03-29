"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Ticket, User, Mail, Phone, GraduationCap, CheckCircle, IdCard, Heart, UserCheck, Droplets, MapPin, Calendar } from "lucide-react";

interface TicketData {
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  studentId?: string;
  university: string;
  gender?: string;
  bloodGroup?: string;
  status: string;
}

export default function TicketCard({ ticket, onDownload }: { ticket: TicketData; onDownload: () => void }) {
  const details = [
    { label: "Registrant Name", value: ticket.fullName, icon: <User className="w-4 h-4" /> },
    { label: "Institution", value: ticket.university, icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Student ID", value: ticket.studentId || "N/A", icon: <IdCard className="w-4 h-4" /> },
    { label: "Gender", value: ticket.gender || "Not Set", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Blood Group", value: ticket.bloodGroup || "N/A", icon: <Droplets className="w-4 h-4" /> },
    { label: "Contact No", value: ticket.phone, icon: <Phone className="w-4 h-4" /> },
    { label: "Email Address", value: ticket.email, icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(128,0,0,0.15)] overflow-hidden border border-slate-50 p-6 md:p-12 relative">
          {/* Top Global Header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
              <div>
                  <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-maroon-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">Official Registry</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Verified Ticket Holder</span>
                  </div>
                  <h1 className="text-5xl font-black text-maroon-950 tracking-tighter">Event Dashboard</h1>
                  <p className="text-slate-500 font-bold text-lg mt-1 tracking-tight">Antorip Farewell Concert Registration confirmed.</p>
              </div>
              <button
                  onClick={onDownload}
                  className="btn-primary w-full md:w-fit px-10 py-5 rounded-2xl flex items-center justify-center gap-4 bg-slate-900 border-none group shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
              >
                  <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-lg font-black tracking-tight">Download Ticket</span>
              </button>
          </div>

          <div className="h-[2px] bg-slate-50 mb-12" />

          {/* Ticket Body Layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
              {/* Ticket Branding Side */}
              <div className="lg:col-span-5 relative group">
                  <div className="absolute inset-0 bg-maroon-900 rounded-[32px] rotate-3 opacity-5 scale-105" />
                  <div className="relative bg-maroon-900 rounded-[32px] p-10 h-full flex flex-col justify-between overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                      {/* Abstract Light */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-700/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative z-10">
                          <p className="text-[10px] font-black text-maroon-300 uppercase tracking-[0.5em] mb-4">Antorip 2026</p>
                          <h3 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none uppercase">Main Stage <br/> <span className="text-maroon-300">April 09</span></h3>
                          <div className="flex items-center gap-2 mb-8">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                             <span className="text-[11px] font-black text-green-400 uppercase tracking-widest">{ticket.status} ACCESS</span>
                          </div>

                          <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                  <MapPin className="w-5 h-5 text-maroon-400 mt-1" />
                                  <div>
                                      <p className="text-xs font-black text-white uppercase tracking-tight">MIST Central Field</p>
                                      <p className="text-[10px] font-bold text-maroon-200 opacity-60 uppercase">Dhaka-1216, BD</p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-3">
                                  <Calendar className="w-5 h-5 text-maroon-400 mt-1" />
                                  <div>
                                      <p className="text-xs font-black text-white uppercase tracking-tight">Thursday, April 09</p>
                                      <p className="text-[10px] font-bold text-maroon-200 opacity-60 uppercase">Evening, 2026</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="relative z-10 pt-10">
                          <p className="text-[9px] font-black text-maroon-400 uppercase tracking-[0.3em] mb-2 leading-none">Entry Protocol</p>
                          <p className="text-2xl font-black text-white tracking-[0.25em]">{ticket.ticketId}</p>
                      </div>
                      
                      {/* Decorative Label */}
                      <div className="absolute bottom-10 right-0 rotate-90 origin-right text-[10px] font-black text-white/5 tracking-[0.8em]">ANTORIP CLASS &apos;26 PASS</div>
                  </div>
              </div>

              {/* Identity side */}
              <div className="lg:col-span-7 bg-slate-50/50 rounded-[40px] p-10 border border-slate-100 flex flex-col justify-center">
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
                      {details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-maroon-700 shadow-sm border border-slate-100">
                                  {detail.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{detail.label}</p>
                                  <p className="text-sm font-black text-slate-900 truncate leading-none uppercase tracking-tight">{detail.value}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="mt-12 bg-maroon-50 rounded-2xl p-6 border border-maroon-100 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-maroon-700" />
                 <p className="text-[11px] font-black text-maroon-900 uppercase tracking-widest text-center md:text-left">Strict Security: Official Student ID required for admission verification.</p>
             </div>
             <p className="text-[9px] font-black text-maroon-400 uppercase tracking-[0.4em] text-center md:text-right">No PDF, No Entry</p>
          </div>
      </div>
    </motion.div>
  );
}

// Sub components
function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
