"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import RegistrationForm from "@/components/RegistrationForm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, Calendar, MapPin, Users, ArrowRight,
  Music, Star, ShieldCheck, 
  Navigation, Compass, Map as MapIcon,
  ChevronDown, Heart, Trophy, Globe, Briefcase,
  Mic2, Radio, Disc
} from "lucide-react";

export default function LandingPage() {
  const [showReg, setShowReg] = useState(false);

  const stats = [
    { label: "Attendees", value: "4500+", icon: <Users className="w-4 h-4" /> },
    { label: "Performance", value: "4 Hours", icon: <Music className="w-4 h-4" /> },
    { label: "Experience", value: "Central Base", icon: <Star className="w-4 h-4" /> },
  ];

  const sponsors = [
    { name: "Global Tech", type: "Platinum", logo: "GT" },
    { name: "Nova Soft", type: "Gold", logo: "NS" },
    { name: "Eco Energy", type: "Sustainability", logo: "EE" },
    { name: "Cloud Sync", type: "Digital", logo: "CS" },
  ];

  const artists = [
    { name: "Headliner Band", genre: "To Be Announced", icon: <Mic2 className="w-6 h-6 text-maroon-700" /> },
    { name: "Special Guest", genre: "Mystery Performance", icon: <Radio className="w-6 h-6 text-maroon-700" /> },
    { name: "Opening Act", genre: "Unveiling Soon", icon: <Disc className="w-6 h-6 text-maroon-700" /> },
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-maroon-700/10 selection:text-maroon-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
          <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-maroon-700/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] left-[5%] w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-1.5 bg-maroon-700/10 text-maroon-700 text-xs font-black uppercase tracking-widest rounded-full border border-maroon-700/10">
                  Farewell Event · 2026
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-maroon-950 tracking-tighter leading-[0.9] mb-8">
                Antorip <br />
                <span className="text-maroon-700">Farewell</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                Mark the end of an era. One final night of music and legacy at the grand 
                <span className="text-maroon-700 font-bold"> MIST Central Field</span>.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => setShowReg(true)}
                  className="btn-primary px-10 py-5 rounded-2xl text-lg font-black group shadow-2xl shadow-maroon-700/20 shadow-[0_20px_50px_rgba(128,0,0,0.15)] bg-slate-900 border-none hover:bg-black"
                >
                  Confirm Registration
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#venue"
                  className="btn-outline px-10 py-5 rounded-2xl text-lg font-black border-2 bg-white text-slate-900 border-slate-100 hover:border-maroon-700/20 shadow-sm"
                >
                  Locate Venue
                </a>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-1.5 text-slate-400 font-black uppercase tracking-widest text-[9px] mb-2 leading-none">
                       {stat.icon}
                       {stat.label}
                    </div>
                    <div className="text-2xl font-black text-maroon-950">{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
               <div className="absolute -inset-4 bg-maroon-700/5 rounded-[40px] rotate-2" />
               <div className="relative aspect-[4/5] bg-maroon-950 rounded-[32px] overflow-hidden shadow-2xl border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-transparent p-12 flex flex-col justify-end">
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md w-fit mb-6">
                        <Calendar className="w-8 h-8 text-maroon-400" />
                     </div>
                     <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">April 09 <br/> <span className="text-maroon-400">2026</span></h3>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Official Schedule</span>
                     </div>
                  </div>
                  {/* Decorative pass ID */}
                  <div className="absolute top-12 right-0 rotate-90 origin-right text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">ACCESS PASS // ANTORIP 09 // 04 // 26</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artist Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto mb-20 text-center">
            <Mic2 className="w-8 h-8 text-maroon-700 mx-auto mb-6" />
            <h2 className="text-5xl font-black text-maroon-950 tracking-tighter mb-6 leading-none uppercase">The Artist Lineup</h2>
            <p className="text-lg text-slate-500 font-medium">Prepare for an auditory journey. A collaboration of legendary performers and emerging talents.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {artists.map((artist, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="group relative p-12 bg-[#FAF9F6] rounded-[48px] border border-slate-100 transition-all hover:shadow-2xl hover:shadow-maroon-700/5"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-50 group-hover:rotate-12 transition-transform">
                  {artist.icon}
                </div>
                <h4 className="text-3xl font-black text-maroon-950 mb-3 uppercase tracking-tighter">{artist.name}</h4>
                <p className="text-[11px] font-black text-maroon-600 uppercase tracking-[0.4em]">{artist.genre}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Row */}
      <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                  <div className="flex-shrink-0">
                      <p className="text-[10px] font-black text-maroon-700 uppercase tracking-[0.3em] mb-4">Strategic Partners</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Project Sponsors</h4>
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center md:justify-start gap-12 opacity-30 group">
                      {sponsors.map((sponsor) => (
                          <div key={sponsor.name} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-crosshair">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">{sponsor.logo}</div>
                              <div>
                                  <p className="text-xs font-black uppercase text-slate-900">{sponsor.name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{sponsor.type}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Venue & Mapping Section */}
      <section id="venue" className="py-24 bg-[#FAF9F6] relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                      <div className="p-4 bg-maroon-700 text-white rounded-3xl w-fit mb-8 shadow-xl shadow-maroon-700/20">
                          <MapIcon className="w-8 h-8" />
                      </div>
                      <h2 className="text-5xl font-black text-maroon-950 tracking-tighter mb-6 leading-none">Central Hub</h2>
                      <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                          The event will take place at the iconic <span className="text-maroon-700 font-black">MIST Central Field</span>. A sprawling outdoor venue curated for the ultimate stadium-grade audio-visual experience.
                      </p>

                      <div className="space-y-6">
                          <div className="flex gap-5 items-start p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                              <div className="p-3 bg-maroon-50 rounded-xl">
                                <Compass className="w-6 h-6 text-maroon-700" />
                              </div>
                              <div>
                                  <h4 className="text-xl font-black text-maroon-950 mb-1 leading-none uppercase tracking-tighter">MIST Central Field</h4>
                                  <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-tight">Mirpur Cantonment, Dhaka 1216</p>
                              </div>
                          </div>
                          <a 
                            href="https://maps.app.goo.gl/HyPzkDY4TNR7pjGq7" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary w-fit px-10 py-5 rounded-2xl flex items-center gap-4 bg-slate-900 border-none shadow-2xl shadow-slate-900/20 active:scale-95 group"
                          >
                              <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                              <span className="font-black uppercase tracking-widest text-sm">Initiate Navigation</span>
                          </a>
                      </div>
                  </div>

                  <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-maroon-700/20 to-amber-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100">
                          <div className="relative rounded-[32px] overflow-hidden aspect-[16/11]">
                              <div className="absolute inset-0 bg-[#f1f5f9]">
                                 <img 
                                   src="https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i23684!3i12484!2m3!1e0!2sm!3i667055182!3m8!2sen!3sBD!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0" 
                                   alt="Venue Map" 
                                   className="w-full h-full object-cover grayscale opacity-60 mix-blend-multiply"
                                 />
                                 <div className="absolute inset-0 bg-maroon-900/10 pointer-events-none" />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-10 bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white flex flex-col items-center max-w-[320px] text-center">
                                       <div className="w-16 h-16 bg-maroon-700 rounded-2xl flex items-center justify-center text-white mb-6 animate-bounce shadow-xl shadow-maroon-700/20">
                                          <MapPin className="w-8 h-8" />
                                       </div>
                                       <p className="text-2xl font-black text-maroon-950 tracking-tighter mb-2 leading-none uppercase">Main Stage</p>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Central Field · 09.04.26</p>
                                    </div>
                                 </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Registration Overlay */}
      <AnimatePresence>
        {showReg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowReg(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[48px] shadow-2xl p-8 md:p-16 relative border border-slate-100"
            >
              <button
                onClick={() => setShowReg(false)}
                className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-full transition-colors group"
              >
                <ChevronDown className="w-7 h-7 text-slate-300 group-hover:text-slate-950" />
              </button>
              
              <div className="mb-12">
                 <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-6 h-6 text-maroon-700" />
                    <span className="text-[10px] font-black text-maroon-700 uppercase tracking-[0.4em]">Official Registry</span>
                 </div>
                 <h2 className="text-5xl font-black text-maroon-950 tracking-tighter mb-4 leading-none">Register Attendance</h2>
                 <p className="text-slate-500 font-bold text-lg tracking-tight leading-relaxed">Securing your spot for April 09. All registration data is verified against the MIST centralized database.</p>
              </div>

              <RegistrationForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-4 mb-12 opacity-30">
                  <div className="w-24 h-[1px] bg-slate-900" />
                  <Heart className="w-4 h-4 text-maroon-700 fill-maroon-700" />
                  <div className="w-24 h-[1px] bg-slate-900" />
              </div>
              <p className="text-[11px] font-black tracking-[0.5em] uppercase text-slate-400 mb-4">Official Product of Antorip Class &apos;26</p>
              <p className="text-sm font-black text-slate-900 uppercase">MIST Central Field, Mirpur Cantonment, Dhaka · 2016</p>
              <p className="text-xs font-black tracking-[0.3em] uppercase text-maroon-700 mt-6">
                Developed by <a href="https://raisul-islam-ratul.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">Raisul Islam Ratul</a>
              </p>
          </div>
      </footer>
    </main>
  );
}
