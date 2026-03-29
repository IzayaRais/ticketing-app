"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Clock, Ticket, Info, Loader2, Calendar, MapPin, Sparkles } from "lucide-react";
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
    // 1. Get from Google Session
    if (status === "authenticated" && session?.user?.email) {
      checkExistingTicket(session.user.email);
    } 
    // 2. Fallback to URL Params or SessionStorage for "Verify" flow
    else {
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
    // Reload ticket after registration
    checkExistingTicket(email);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
      </div>
    );
  }

  const displayName = session?.user?.name || existingTicket?.fullName || "Guest";

  const HeaderSection = ({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) => (
    <div className="pt-20 bg-cream border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-maroon-700" />
              <p className="text-xs font-black text-maroon-700 uppercase tracking-[0.2em]">
                Antorip Welcome · {displayName}
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-maroon-950 leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-slate-500 font-medium max-w-lg leading-relaxed">
              {subtitle}
            </p>
          </div>
          {badge && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-green-100 rounded-xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{badge}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const isVerifiedAccess = existingTicket && (!session || existingTicket.email === (session.user?.email || existingTicket.email));

  return (
    <>
      {!session && !existingTicket ? (
        <>
          <HeaderSection 
            title="Secure Your Invite" 
            subtitle="Please sign in with Google or use your entry code to access the Antorip Farewell Concert portal." 
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
              <aside className="lg:col-span-1 space-y-6">
                <div className="card-premium p-6 bg-cream/50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 grad-maroon rounded-xl">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-maroon-900 leading-tight">Antorip 2026</h3>
                      <p className="text-xs text-maroon-600/60 font-bold uppercase tracking-widest mt-0.5">Countdown Active</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Gate Open", value: "May 2026" },
                      { label: "Eligibility", value: "Students Pass" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-maroon-700/5">
                        <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
                        <span className="text-sm font-bold text-maroon-950">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
              <div className="lg:col-span-2">
                <div className="card-premium p-10 text-center">
                  <h2 className="text-3xl font-black text-maroon-950 mb-8">Choose Access Method</h2>
                  <div className="max-w-md mx-auto space-y-4">
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="w-full py-5 px-6 rounded-2xl grad-maroon text-white shadow-xl shadow-maroon-700/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 font-black"
                    >
                       <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Quick Google Registry
                    </button>
                    <div className="relative py-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-xs uppercase font-bold text-slate-300 bg-white px-4">Already Registered?</div>
                    </div>
                    <Link href="/verify" className="flex items-center justify-center gap-2 group w-full py-4 text-maroon-700 font-black hover:text-maroon-900 transition-colors">
                      <Ticket className="w-5 h-5 text-maroon-600/40 group-hover:scale-110 transition-transform" />
                      Verify Entry Code
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <HeaderSection 
            title={existingTicket ? "Your Event Pass" : "Complete Registration"} 
            subtitle={existingTicket 
              ? "Your entry protocol for the Antorip Farewell Concert is cleared. Access your digital pass below." 
              : "Welcome! please provide your student information to finalize your registration and receive your pass."
            }
            badge={existingTicket ? "Registry Cleared" : "Auth Success"}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
              <aside className="lg:col-span-1 space-y-6">
                <div className="card-premium p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 grad-maroon rounded-xl shadow-lg shadow-maroon-700/25">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-maroon-900 leading-tight">Venue Info</h3>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Dhaka Metropolitan</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Status", value: existingTicket ? "Verified" : "Pending" },
                      { label: "Pass Level", value: "Standard Student" },
                      { label: "Registry Date", value: existingTicket ? new Date(existingTicket.timestamp).toLocaleDateString() : "Live" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm font-black text-maroon-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {sideFeatures.map((f) => (
                    <div key={f.title} className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-maroon-700/10 transition-colors">
                      <div className="p-2 bg-maroon-700/8 rounded-lg">
                        <f.icon className="w-4 h-4 text-maroon-700" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-maroon-900">{f.title}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="lg:col-span-2">
                {existingTicket ? (
                  <TicketCard ticket={existingTicket} onDownload={handleDownload} />
                ) : (
                  <div className="card-premium p-8 md:p-10 border-t-4 border-t-maroon-700">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                        <h2 className="text-2xl font-black text-maroon-950">Registration Details</h2>
                        <p className="text-sm text-slate-400 font-medium">Finalize your invitation for the legend's farewell.</p>
                       </div>
                       <Info className="w-6 h-6 text-slate-200" />
                    </div>
                    <div className="divider-elegant mb-8" />
                    <RegistrationForm onSuccess={handleRegistrationSuccess} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-offwhite">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
