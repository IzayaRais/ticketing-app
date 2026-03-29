"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Clock, Ticket, Info, Loader2, Calendar, MapPin, Sparkles, CheckCircle, ArrowRight, Mail, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import RegistrationForm from "@/components/RegistrationForm";
import TicketCard from "@/components/TicketCard";

const sideFeatures = [
  {
    icon: Shield,
    title: "Secure Entry",
    desc: "Your ticket data is cross-referenced with your official institution records at the gate.",
  },
  {
    icon: Clock,
    title: "Instant Delivery",
    desc: "Your farewell pass is generated and delivered to your dashboard instantly upon approval.",
  },
  {
    icon: Ticket,
    title: "Unique QR Pass",
    desc: "Every registration generates a secure encrypted entry pass unique to your email.",
  },
];

function DashboardContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [existingTicket, setExistingTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      checkExistingTicket(session.user.email);
    } else {
      const verifiedEmail = searchParams.get("verifiedEmail") || sessionStorage.getItem("verifiedEmail");
      const verifiedId = searchParams.get("verifiedId") || sessionStorage.getItem("verifiedId");

      if (verifiedEmail && verifiedId) {
        checkExistingTicket(verifiedEmail, verifiedId);
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    }
  }, [status, session, searchParams]);

  const checkExistingTicket = async (email: string, ticketId?: string) => {
    try {
      const res = await fetch(`/api/ticket/email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.exists) {
        if (ticketId && data.ticket.ticketId !== ticketId) {
          console.error("Ticket ID mismatch");
          setLoading(false);
          return;
        }
        setExistingTicket(data.ticket);
      }
    } catch (error) {
      console.error("Error checking ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (existingTicket?.ticketId) {
      window.open(`/api/ticket/${existingTicket.ticketId}`, "_blank");
    }
  };

  const handleRegistrationSuccess = (ticketId: string, email: string) => {
    checkExistingTicket(email);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = session?.user?.name || existingTicket?.fullName || "Guest";

  const isVerifiedAccess = existingTicket && (!session || existingTicket.email === (session.user?.email || existingTicket.email));

  return (
    <>
      {!session && !existingTicket ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
          <div className="pt-28 pb-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Antorip 2026</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                  Secure Your <span className="text-amber-500">Invite</span>
                </h1>
                <p className="text-slate-300 font-medium text-lg max-w-2xl mx-auto">
                  Sign in with Google or verify your entry code to access the Antorip Farewell Concert registration portal.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">Event Details</h3>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">April 09, 2026</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-bold text-slate-700">MIST Central Field</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-bold text-slate-700">Gate Opens: 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-green-700">4500+ Registered</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Choose Access Method</h2>
                  <p className="text-slate-500 font-medium mb-8">Select how you want to access the registration portal</p>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 py-5 px-6 rounded-2xl text-white shadow-lg shadow-slate-800/20 hover:shadow-xl hover:shadow-slate-800/30 transition-all flex items-center justify-center gap-4 font-black"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                        <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="relative z-10">Continue with Google</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                      <div className="relative flex justify-center text-xs uppercase font-bold text-slate-300 bg-white px-4">Or</div>
                    </div>
                    
                    <Link 
                      href="/verify" 
                      className="w-full group flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-amber-500 hover:text-amber-600 transition-all"
                    >
                      <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Verify Entry Code</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
          <div className="pt-28 pb-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {existingTicket && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Registered
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    {existingTicket ? "Your Event Pass" : "Complete Registration"}
                  </h1>
                  <p className="text-slate-300 font-medium mt-2 max-w-lg">
                    {existingTicket 
                      ? "Your entry protocol for the Antorip Farewell Concert is cleared." 
                      : "Welcome! Please provide your student information to finalize your registration."}
                  </p>
                </div>
                {session?.user && (
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
                    {session.user.image ? (
                      <img src={session.user.image} alt="User" className="w-10 h-10 rounded-full border-2 border-amber-500" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-bold">{session.user.name}</p>
                      <p className="text-slate-400 text-xs">{session.user.email}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">Venue</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">MIST Central Field</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                      <span className="text-sm font-black text-green-600">{existingTicket ? "Verified" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase">Pass Type</span>
                      <span className="text-sm font-bold text-slate-700">Standard Student</span>
                    </div>
                    {existingTicket && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Date</span>
                        <span className="text-sm font-bold text-slate-700">
                          {new Date(existingTicket.timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {sideFeatures.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:border-amber-100 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <f.icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{f.title}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                {existingTicket ? (
                  <TicketCard ticket={existingTicket} onDownload={handleDownload} />
                ) : (
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">Registration Details</h2>
                        <p className="text-sm text-slate-400 font-medium">Complete your information to receive your pass</p>
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
                    <RegistrationForm onSuccess={handleRegistrationSuccess} />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
