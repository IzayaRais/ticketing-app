"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import RegistrationForm from "@/components/RegistrationForm";

import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Calendar, Users, ArrowRight,
  Music, Star, ShieldCheck,
  Navigation, Compass, Map as MapIcon,
  ChevronDown,
  Mic2, Mail
} from "lucide-react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-04-09T18:00:00").getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-maroon-700/5 border border-maroon-700/10 rounded-2xl flex items-center justify-center mb-2">
            <span className="text-2xl md:text-3xl font-black text-maroon-700 tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [showReg, setShowReg] = useState(false);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);
  const [selectedInst, setSelectedInst] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedInstitute");
    setSelectedInst(stored);
  }, []);

  const handleConfirmedClick = () => {
    if (selectedInst === "BUP" || selectedInst === "AFMC") {
      setQuotaMessage(`Registration Quota for ${selectedInst} is full. Try again next time.`);
      setTimeout(() => setQuotaMessage(null), 5000); // Hide after 5s
      return;
    }
    setShowReg(true);
  };

  const stats = [
    { label: "Attendees", value: "4500+", icon: <Users className="w-4 h-4" /> },
    { label: "Performance", value: "4 Hours", icon: <Music className="w-4 h-4" /> },
    { label: "Experience", value: "Central Base", icon: <Star className="w-4 h-4" /> },
  ];

  const artists = [
    { 
      name: "Nemesis", 
      role: "Headliner", 
      genre: "Modern Rock", 
      photo: "https://www.tbsnews.net/sites/default/files/styles/infograph/public/images/2025/05/22/nemesis_band_photo.png",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSB_XZwqEBeqHVhM3Dm24q6gdX0iQw_QcFgA&s"
    },
    { 
      name: "Level5", 
      role: "Special Guest", 
      genre: "Indie Pop", 
      photo: "https://i.scdn.co/image/ab6761610000e5eb8bb57badc52a082653137635",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSanEHbrB1VhH0_pwNE-RPRZU-WNcL10R-mHg&s"
    },
    { 
      name: "MIST Band", 
      role: "Opening Act", 
      genre: "Campus Rock", 
      photo: "https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-6/492691796_1270941918368342_9013690205630182707_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeF4nMXqB-NndDu_-s69vhFGp945jSdxtf-n3jmNJ3G1_3YDBIuzyW75u7yiPrZK03M1XX4dAGXExt7Qe3w-3g_t&_nc_ohc=VLvTyUC29P8Q7kNvwGbYWNd&_nc_oc=AdoaCBk03rRacMNVVGEIKCn3M3IcZH50qAReQqxErwB6hfSsx0XucrOjIvdo9WhzJE0&_nc_zt=23&_nc_ht=scontent.fdac207-1.fna&_nc_gid=bGvy0YslOxImU5s2H8IX-w&_nc_ss=7a3a8&oh=00_Af0xcUHR7q9gXNTfYXP33NpSip1LkoNS2c7rpJEBzRdsBA&oe=69D83563",
      logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Military_Institute_of_Science_and_Technology_Monogram.svg"
    },
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
                অন্তরীপ ২১ <br />
                <span className="text-maroon-700">Farewell</span>
              </h1>

              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                Mark the end of an era. One final night of music and legacy at the grand
                <span className="text-maroon-700 font-bold"> MIST Central Field</span>.
              </p>

              <div className="mb-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">Event Starts In</p>
                <CountdownTimer />
              </div>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={handleConfirmedClick}
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
                  <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">April 09 <br /> <span className="text-maroon-400">2026</span></h3>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Official Schedule</span>
                  </div>
                </div>
                {/* Decorative pass ID */}
                <div className="absolute top-12 right-0 rotate-90 origin-right text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">ACCESS PASS // অন্তরীপ ২১ 09 // 04 // 26</div>
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
                className="group relative h-[450px] rounded-[48px] overflow-hidden border border-slate-100 transition-all hover:shadow-2xl hover:shadow-maroon-700/5"
              >
                {/* Band Photo Background */}
                <div className="absolute inset-0">
                  <Image 
                    src={artist.photo}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/40 to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="relative h-full p-10 flex flex-col justify-end text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30 group-hover:rotate-12 transition-transform">
                     <Image 
                        src={artist.logo}
                        alt={`${artist.name} Logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                     />
                  </div>
                  <h4 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{artist.name}</h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-maroon-400 uppercase tracking-[0.4em]">{artist.role}</p>
                    <p className="text-xs font-bold text-white/60 tracking-wider uppercase italic">{artist.genre}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Row */}
      <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[11px] font-black text-maroon-700 uppercase tracking-[0.4em] mb-4">Strategic Partnerships</p>
            <h2 className="text-4xl font-black text-maroon-950 tracking-tight uppercase">Our Valuable Sponsors</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {/* Title Sponsor */}
            <div className="flex flex-col items-center group">
              <span className="px-4 py-1 bg-maroon-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-8">Title Sponsor</span>
              <div className="relative h-32 w-full flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image 
                  src="/logo/TBPLC_Logo_ENG with tagline.png" 
                  alt="Trust Bank PLC" 
                  width={320} 
                  height={100} 
                  className="object-contain"
                />
              </div>
              <h4 className="mt-8 text-xl font-black text-maroon-950">Trust Bank PLC</h4>
            </div>

            {/* Co-powered By */}
            <div className="flex flex-col items-center group">
              <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-8">Co-powered by</span>
              <div className="relative h-32 w-full flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image 
                  src="/logo/taha.png" 
                  alt="Taha Group" 
                  width={240} 
                  height={80} 
                  className="object-contain"
                />
              </div>
              <h4 className="mt-8 text-xl font-black text-maroon-950">Taha Group</h4>
            </div>

            {/* Food Partner */}
            <div className="flex flex-col items-center group">
              <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-8">Food Partner</span>
              <div className="relative h-32 w-full flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image 
                  src="/logo/onno.png" 
                  alt="অন্ন" 
                  width={180} 
                  height={80} 
                  className="object-contain"
                />
              </div>
              <h4 className="mt-8 text-xl font-black text-maroon-950">অন্ন</h4>
            </div>
          </div>

          <div className="pt-16 border-t border-slate-100 flex flex-col items-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Event Host</p>
            <div className="inline-flex items-center gap-4 py-4 px-8 bg-maroon-50/50 rounded-2xl border border-maroon-100/50">
              <div className="w-1.5 h-1.5 rounded-full bg-maroon-700 animate-pulse" />
              <h3 className="text-2xl font-black text-maroon-950 tracking-tight">
                Organized By: <span className="text-maroon-700">Directorate of Student Welfare, MIST</span>
              </h3>
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

            <div className="relative">
              <div className="bg-white p-4 rounded-[32px] shadow-2xl border border-slate-100">
                <div className="rounded-[24px] overflow-hidden aspect-[16/11] border border-slate-200">
                  <iframe
                    title="MIST Central Field Map"
                    src="https://www.google.com/maps?q=MIST%20Central%20Field%2C%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 mt-3 px-2">
                  <p className="text-sm font-bold text-slate-700">Live Venue Map - MIST Central Field</p>
                  <a
                    href="https://maps.app.goo.gl/HyPzkDY4TNR7pjGq7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-maroon-700 hover:text-maroon-800 underline"
                  >
                    Open Full Map
                  </a>
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

      <AnimatePresence>
        {quotaMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full"
          >
            <div className="mx-4 p-4 bg-maroon-700 text-white font-black rounded-2xl shadow-2xl flex items-center gap-3 border border-maroon-600">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm tracking-tight">{quotaMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-maroon-600 to-maroon-800 rounded-xl flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black">অন্তরীপ ২১</h3>
                  <p className="text-xs text-maroon-400 font-bold uppercase tracking-wider">Farewell 2026</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 max-w-sm">
                The official ticketing platform for অন্তরীপ ২১ Farewell Concert 2026. Secure your spot at the most anticipated musical event of the year.
              </p>
              <div className="flex gap-4">
                <a href="mailto:raisultensors@gmail.com" className="w-10 h-10 bg-slate-800 hover:bg-maroon-600 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/antorip" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-maroon-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://instagram.com/antorip" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-maroon-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-maroon-400 mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Home</Link></li>
                <li><Link href="/dashboard" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Register</Link></li>
                <li><Link href="/verify" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Verify Ticket</Link></li>
                <li><Link href="/admin" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-maroon-400 mb-6">Help & Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:raisultensors@gmail.com" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Contact Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-maroon-400 transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-maroon-400 mb-6">Event Info</h4>
              <ul className="space-y-3">
                <li className="text-slate-400 text-sm">April 09, 2026</li>
                <li className="text-slate-400 text-sm">MIST Central Field</li>
                <li className="text-slate-400 text-sm">Mirpur Cantonment, Dhaka</li>
                <li className="text-slate-400 text-sm">Gates open 1:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">
                © 2026 অন্তরীপ ২১ Class &apos;26. All rights reserved.
              </p>
              <p className="text-slate-600 text-sm">
                Developed by <a href="https://raisul-islam-ratul.vercel.app" target="_blank" rel="noopener noreferrer" className="text-maroon-400 hover:text-maroon-300 font-bold transition-colors">Raisul Islam Ratul</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
