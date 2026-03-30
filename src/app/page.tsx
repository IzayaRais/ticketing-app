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
  Mic2, Radio, Disc, Mail, Sparkles, Clock
} from "lucide-react";

export default function LandingPage() {
  const [showReg, setShowReg] = useState(false);

  const stats = [
    { label: "Attendees", value: "4500+", icon: <Users className="w-4 h-4" /> },
    { label: "Duration", value: "4 Hours", icon: <Clock className="w-4 h-4" /> },
    { label: "Venue", value: "Central Base", icon: <Star className="w-4 h-4" /> },
  ];

  const sponsors = [
    { name: "Global Tech", type: "Platinum", logo: "GT" },
    { name: "Nova Soft", type: "Gold", logo: "NS" },
    { name: "Eco Energy", type: "Sustainability", logo: "EE" },
    { name: "Cloud Sync", type: "Digital", logo: "CS" },
  ];

  const artists = [
    { name: "Headliner Band", genre: "To Be Announced", icon: <Mic2 className="w-8 h-8" /> },
    { name: "Special Guest", genre: "Mystery Performance", icon: <Radio className="w-8 h-8" /> },
    { name: "Opening Act", genre: "Unveiling Soon", icon: <Disc className="w-8 h-8" /> },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-slate-100 selection:bg-amber-500/20 selection:text-amber-200">
      <Navbar />
      
      {/* Hero Section - Dramatic Concert Night Theme */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(128,0,0,0.4)_0%,_transparent_50%)]" />
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-maroon-900/30 rounded-full blur-[120px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="px-5 py-2 bg-gradient-to-r from-amber-500/20 to-maroon-500/20 text-amber-400 text-xs font-bold uppercase tracking-[0.3em] rounded-full border border-amber-500/30 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 inline mr-2" />
                  Farewell Event · 2026
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_amber-500]" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8"
              >
                Antorip <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">Farewell</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-xl"
              >
                Mark the end of an era. One final night of music and legacy at the iconic 
                <span className="text-amber-400 font-semibold"> MIST Central Field</span>.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap gap-5 mb-16"
              >
                <button
                  onClick={() => setShowReg(true)}
                  className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-lg font-black overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3 text-slate-900">
                    Secure Your Spot
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <a
                  href="#venue"
                  className="px-10 py-5 rounded-2xl text-lg font-bold border-2 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all duration-300 flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5 text-amber-400" />
                  View Venue
                </a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-800"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3 group-hover:text-amber-400 transition-colors">
                       {stat.icon}
                       {stat.label}
                    </div>
                    <div className="text-3xl font-black text-white group-hover:text-amber-400 transition-colors">{stat.value}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
               <div className="absolute -inset-6 bg-gradient-to-br from-amber-500/10 via-maroon-500/10 to-transparent rounded-[60px] blur-2xl" />
               <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[48px] overflow-hidden shadow-2xl border border-slate-700/50">
                  {/* Concert pass design */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(245,158,11,0.15)_0%,_transparent_50%)]" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 border-4 border-amber-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Access Level</p>
                        <p className="text-lg font-black text-amber-400 uppercase">VIP</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-2">Event Date</p>
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                          April 09 <br /> 
                          <span className="text-amber-500">2026</span>
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Gate Opens: 6:00 PM</span>
                      </div>

                      <div className="pt-6 border-t border-slate-700/50">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Venue</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight">MIST Central Field</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">Mirpur Cantonment, Dhaka</p>
                      </div>
                    </div>

                    {/* Decorative pass ID */}
                    <div className="absolute top-16 right-0 rotate-90 origin-right text-[8px] font-bold text-slate-600 tracking-[0.6em] uppercase">Access Pass // ANTORIP 09 // 04 // 26</div>
                  </div>
                  
                  {/* Holographic effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30" />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artist Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(128,0,0,0.2)_0%,_transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-maroon-900/30 rounded-full mb-8">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Live Performance</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Artist</span> Lineup
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
              Prepare for an auditory journey. A collaboration of legendary performers and emerging talents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {artists.map((artist, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative p-10 bg-gradient-to-br from-slate-900 to-slate-800/50 rounded-[32px] border border-slate-700/50 hover:border-amber-500/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(245,158,11,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-700/50 group-hover:border-amber-500/30 group-hover:scale-110 transition-all duration-500">
                    <div className="text-amber-500/80 group-hover:text-amber-400 transition-colors">
                      {artist.icon}
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter text-center">{artist.name}</h4>
                  <p className="text-center text-amber-500/80 font-bold text-xs uppercase tracking-[0.3em]">{artist.genre}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Row */}
      <section className="py-16 bg-[#0a0a0a] border-y border-slate-800/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                  <div className="flex-shrink-0">
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em] mb-4">Strategic Partners</p>
                      <h4 className="text-2xl font-black text-white tracking-tight">Project Sponsors</h4>
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center md:justify-start gap-12 opacity-40 group-hover:opacity-60 transition-opacity">
                      {sponsors.map((sponsor) => (
                          <div key={sponsor.name} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl flex items-center justify-center font-black text-sm border border-slate-600">{sponsor.logo}</div>
                              <div>
                                  <p className="text-xs font-bold uppercase text-slate-300">{sponsor.name}</p>
                                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{sponsor.type}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Venue Section - Dramatic */}
      <section id="venue" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(128,0,0,0.3)_0%,_transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-8">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Location</span>
                      </div>
                      <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-none">
                        Central <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Hub</span>
                      </h2>
                      <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-lg">
                          The event will take place at the iconic <span className="text-amber-400 font-semibold">MIST Central Field</span>. A sprawling outdoor venue curated for the ultimate stadium-grade audio-visual experience.
                      </p>

                      <div className="space-y-6">
                          <div className="flex gap-5 items-start p-6 bg-gradient-to-br from-slate-900 to-slate-800/50 rounded-2xl border border-slate-700/50">
                              <div className="p-3 bg-amber-500/10 rounded-xl">
                                <Compass className="w-6 h-6 text-amber-500" />
                              </div>
                              <div>
                                  <h4 className="text-xl font-black text-white mb-1 leading-none uppercase tracking-tight">MIST Central Field</h4>
                                  <p className="text-sm font-medium text-slate-500 mt-2">Mirpur Cantonment, Dhaka 1216</p>
                              </div>
                          </div>
                          <a 
                            href="https://maps.app.goo.gl/HyPzkDY4TNR7pjGq7" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl font-bold text-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300"
                          >
                              <Navigation className="w-5 h-5" />
                              <span className="uppercase tracking-wider text-sm">Get Directions</span>
                          </a>
                      </div>
                  </div>

                  <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 to-maroon-500/10 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-[48px] shadow-2xl border border-slate-700/50">
                          <div className="relative rounded-[36px] overflow-hidden aspect-[16/11]">
                              <div className="absolute inset-0 bg-[#1a1a2e]">
                                 <img 
                                   src="https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i23684!3i12484!2m3!1e0!2sm!3i667055182!3m8!2sen!3sBD!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0" 
                                   alt="Venue Map" 
                                   className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="p-8 bg-slate-900/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-slate-700/50 flex flex-col items-center text-center max-w-[280px]">
                                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-slate-900 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                       <MapPin className="w-10 h-10" />
                                    </div>
                                    <p className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Main Stage</p>
                                    <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Central Field · 09.04.26</p>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowReg(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] shadow-2xl p-8 md:p-12 relative border border-slate-700/50"
            >
              <button
                onClick={() => setShowReg(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-700/50 rounded-full transition-colors group"
              >
                <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-white rotate-45 transition-transform" />
              </button>
              
              <div className="mb-10">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-6">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Official Registry</span>
                 </div>
                 <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                   Register <span className="text-amber-500">Attendance</span>
                 </h2>
                 <p className="text-slate-400 font-medium text-lg">Secure your spot for April 09. All registrations are verified against the MIST centralized database.</p>
              </div>

              <RegistrationForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#050505] text-white border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Antorip</h3>
                  <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Farewell 2026</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6 max-w-sm">
                The official ticketing platform for Antorip Farewell Concert 2026. Secure your spot at the most anticipated musical event of the year.
              </p>
              <div className="flex gap-3">
                <a href="mailto:raisultensors@gmail.com" className="w-10 h-10 bg-slate-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/antorip" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com/antorip" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-amber-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Home</a></li>
                <li><a href="/dashboard" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Register</a></li>
                <li><a href="/verify" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Verify Ticket</a></li>
                <li><a href="/admin" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Admin</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:raisultensors@gmail.com" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Contact Support</a></li>
                <li><a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6">Event Info</h4>
              <ul className="space-y-3">
                <li className="text-slate-500 text-sm">April 09, 2026</li>
                <li className="text-slate-500 text-sm">MIST Central Field</li>
                <li className="text-slate-500 text-sm">Mirpur Cantonment, Dhaka</li>
                <li className="text-slate-500 text-sm">Gate opens 6:00 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-sm">
                © 2026 Antorip Class '26. All rights reserved.
              </p>
              <p className="text-slate-600 text-sm">
                Developed by <a href="https://raisul-islam-ratul.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">Raisul Islam Ratul</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
