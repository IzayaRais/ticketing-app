"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Ticket, User, Mail, Phone, GraduationCap, CheckCircle, IdCard, Heart, UserCheck, Droplets, MapPin, Calendar, Copy, Check, Shield } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(128,0,0,0.15)] overflow-hidden border border-slate-100 p-6 md:p-10 relative">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Holder</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800">Your Ticket</h1>
            <p className="text-slate-500 font-medium mt-1">Antorip Farewell Concert 2026 - Registration Confirmed</p>
          </div>
          <button
            onClick={onDownload}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-maroon-700/25 hover:shadow-xl hover:shadow-maroon-700/40 hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download Ticket</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900 rounded-3xl p-6 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-maroon-700/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-maroon-600/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-maroon-300" />
                    <span className="text-xs font-bold text-maroon-300 uppercase tracking-wider">Entry Pass</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-400 uppercase">Active</span>
                  </div>
                </div>

                <p className="text-[9px] font-bold text-maroon-300 uppercase tracking-widest mb-2">Event Date</p>
                <h3 className="text-2xl font-black text-white mb-4">April 09, 2026</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-maroon-300 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">MIST Central Field</p>
                      <p className="text-[10px] text-maroon-200">Mirpur Cantonment, Dhaka</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-maroon-300 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Gate Opens: 6:00 PM</p>
                      <p className="text-[10px] text-maroon-200">Evening Session</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-maroon-700">
                <p className="text-[9px] font-bold text-maroon-300 uppercase tracking-widest mb-2">Your Ticket ID</p>
                <div className="flex items-center justify-between bg-maroon-800/50 rounded-xl p-3">
                  <p className="text-lg font-black text-maroon-300 tracking-wider">{ticket.ticketId}</p>
                  <button
                    onClick={copyTicketId}
                    className="p-2 hover:bg-maroon-700 rounded-lg transition-colors"
                    title="Copy Ticket ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-maroon-300" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-[10px] text-green-400 font-bold mt-2 text-center">Copied to clipboard!</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-full">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-maroon-600" />
                <h3 className="text-lg font-black text-slate-800">Attendee Details</h3>
              </div>
              
              <div className="space-y-3">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-maroon-50 rounded-lg flex items-center justify-center text-maroon-600 flex-shrink-0">
                      {detail.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{detail.label}</p>
                      <p className="text-sm font-bold text-slate-800 break-words">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-maroon-50 to-red-50 rounded-xl border border-maroon-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-maroon-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Pass Level: Student/On Going Student</p>
                    <p className="text-xs text-slate-500 mt-1">Bring your original student ID card for verification at the gate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maroon-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-maroon-600" />
            </div>
            <p className="text-sm font-medium text-slate-600">Original student ID required for venue entry</p>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No ID, No Entry</p>
        </div>
      </div>
    </motion.div>
  );
}
