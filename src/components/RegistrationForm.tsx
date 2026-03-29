"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationData, institutes } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, CheckCircle2,
  User, Mail, Phone, GraduationCap,
  IdCard, UserCheck, Droplets, CheckSquare,
  ArrowRight, Send
} from "lucide-react";


const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;
const genders = ["Male", "Female", "Other"] as const;

export default function RegistrationForm({ onSuccess }: { onSuccess?: (ticketId: string, email: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { terms: false },
  });
  const acceptedTerms = watch("terms");

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(result.ticketId, result.email);
      } else {
        setTimeout(() => {
          router.push(`/success?id=${result.ticketId}&email=${result.email}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Registration Complete!</h3>
        <p className="text-slate-500 font-medium">Your ticket is being generated...</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-100 rounded-2xl"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-900 text-sm">Registration Failed</p>
              <p className="text-red-700/80 mt-0.5 text-xs">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-600 mr-1">●</span> Full Name
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-600 to-maroon-800 rounded-l-2xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <input
              {...register("fullName")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.fullName.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> Email Address
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <input
              {...register("email")}
              type="email"
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
              placeholder="your.email@university.edu"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> Phone Number
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <input
              {...register("phone")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
              placeholder="+880 1XXXXXXXXX"
            />
          </div>
          {errors.phone && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.phone.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> Student ID
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center">
              <IdCard className="w-5 h-5 text-white" />
            </div>
            <input
              {...register("studentId")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
              placeholder="Your Student ID"
            />
          </div>
          {errors.studentId && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.studentId.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> University
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center z-10">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <select
              {...register("university")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Select your university</option>
              {institutes.map(inst => <option key={inst} value={inst}>{inst}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-maroon-500 rounded-full"></div>
            </div>
          </div>
          {errors.university && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.university.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> Gender
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center z-10">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <select
              {...register("gender")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Select gender</option>
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-maroon-500 rounded-full"></div>
            </div>
          </div>
          {errors.gender && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.gender.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative md:col-span-2"
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
            <span className="text-maroon-500 mr-1">●</span> Blood Group
          </label>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-maroon-500 to-maroon-500 rounded-l-2xl flex items-center justify-center z-10">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <select
              {...register("bloodGroup")}
              className="w-full pl-16 pr-4 py-4 bg-white border-2 border-slate-200 rounded-r-2xl outline-none focus:border-maroon-500 focus:ring-4 focus:ring-maroon-500/10 transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Select blood group</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 bg-maroon-500 rounded-full"></div>
            </div>
          </div>
          {errors.bloodGroup && (
            <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.bloodGroup.message}</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="pt-2"
      >
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              {...register("terms")}
              className="peer sr-only"
            />
            <div className={`w-7 h-7 rounded-xl border-2 transition-all flex items-center justify-center ${
              acceptedTerms 
                ? "bg-gradient-to-br from-maroon-400 to-maroon-500 border-maroon-500 shadow-lg shadow-maroon-500/20" 
                : "bg-white border-slate-200 group-hover:border-maroon-400"
            }`}>
              {acceptedTerms && <CheckSquare className="w-4 h-4 text-white" />}
            </div>
          </div>
          <span className="text-sm font-medium text-slate-500 leading-relaxed pt-0.5">
            I confirm that all information provided is accurate and I agree to the <span className="text-maroon-600 font-bold">terms and conditions</span>. I understand that my entry is subject to verification of my student credentials.
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-2 ml-11">
            <AlertCircle className="w-3 h-3" />
            Please accept the terms to continue
          </p>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full group relative overflow-hidden bg-gradient-to-r from-maroon-500 via-maroon-500 to-maroon-500 bg-[length:200%_100%] hover:bg-[100%_0] py-5 rounded-2xl text-white font-black text-lg shadow-2xl shadow-maroon-500/25 hover:shadow-maroon-500/40 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="relative flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="uppercase tracking-wider">Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Registration</span>
              <ArrowRight className="w-5 h-5 absolute right-6 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </div>
      </motion.button>
    </form>
  );
}
