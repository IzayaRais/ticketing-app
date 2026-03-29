"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationData } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, CheckCircle2,
  User, Mail, Phone, GraduationCap, Shirt,
  IdCard, UserCheck, Droplets, CheckSquare
} from "lucide-react";

const tshirtSizes = ["S", "M", "L", "XL", "XXL"] as const;
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;
const genders = ["Male", "Female"] as const;

interface FieldWrapperProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, icon, error, children }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
        <span className="text-maroon-700">{icon}</span>
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-bold text-red-500 flex items-center gap-1.5 pt-0.5 pl-1"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegistrationForm({ onSuccess }: { onSuccess?: (ticketId: string, email: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { tshirtSize: "M", terms: false },
  });

  const selectedSize = watch("tshirtSize");
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

      if (onSuccess) {
        onSuccess(result.ticketId, result.email);
      } else {
        router.push(`/success?id=${result.ticketId}&email=${result.email}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-3xl"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-red-900 uppercase tracking-tight text-sm">Action Required</p>
              <p className="text-red-700/80 mt-0.5 font-bold text-xs leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
        <FieldWrapper label="Registrant Name" icon={<User className="w-3.5 h-3.5" />} error={errors.fullName?.message}>
          <input
            {...register("fullName")}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800"
            placeholder="Full Identity"
          />
        </FieldWrapper>

        <FieldWrapper label="Email Address" icon={<Mail className="w-3.5 h-3.5" />} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800"
            placeholder="you@university.edu"
          />
        </FieldWrapper>

        <FieldWrapper label="Contact No" icon={<Phone className="w-3.5 h-3.5" />} error={errors.phone?.message}>
          <input
            {...register("phone")}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800"
            placeholder="+880"
          />
        </FieldWrapper>

        <FieldWrapper label="Student ID" icon={<IdCard className="w-3.5 h-3.5" />} error={errors.studentId?.message}>
          <input
            {...register("studentId")}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800"
            placeholder="Own Institution ID"
          />
        </FieldWrapper>

        <FieldWrapper label="University (Short)" icon={<GraduationCap className="w-3.5 h-3.5" />} error={errors.university?.message}>
          <input
            {...register("university")}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800"
            placeholder="e.g. MIST, BUET"
          />
        </FieldWrapper>

        <FieldWrapper label="Gender" icon={<UserCheck className="w-3.5 h-3.5" />} error={errors.gender?.message}>
          <select
             {...register("gender")}
             className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800 appearance-none bg-no-repeat bg-[right_1.5rem_center]"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23800000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 15 5 5 5-5'/%3E%3Cpath d='m7 9 5-5 5-5'/%3E%3C/svg%3E")` }}
          >
            <option value="">Select Identity</option>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </FieldWrapper>

        <FieldWrapper label="Blood Group" icon={<Droplets className="w-3.5 h-3.5" />} error={errors.bloodGroup?.message}>
          <select
            {...register("bloodGroup")}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/5 transition-all font-bold text-slate-800 appearance-none bg-no-repeat bg-[right_1.5rem_center]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23800000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 15 5 5 5-5'/%3E%3Cpath d='m7 9 5-5 5-5'/%3E%3C/svg%3E")` }}
          >
            <option value="">Select Group</option>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </FieldWrapper>

         <FieldWrapper label="T-Shirt Selection" icon={<Shirt className="w-3.5 h-3.5" />} error={errors.tshirtSize?.message}>
          <div className="flex gap-2.5">
            {tshirtSizes.map((size) => (
              <label key={size} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value={size}
                  {...register("tshirtSize")}
                  className="peer sr-only"
                />
                <div
                  className={`text-center py-4 rounded-2xl border-2 font-black text-[10px] transition-all duration-200 ${
                    selectedSize === size
                      ? "border-maroon-700 bg-maroon-700 text-white shadow-xl shadow-maroon-700/20"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-maroon-700/20 hover:text-maroon-700"
                  }`}
                >
                  {size}
                </div>
              </label>
            ))}
          </div>
        </FieldWrapper>
      </div>

      <div className="pt-6 space-y-6">
        <label className="flex items-start gap-4 cursor-pointer group select-none">
          <div className="relative mt-1">
            <input
              type="checkbox"
              {...register("terms")}
              className="peer sr-only"
            />
            <div className={`w-7 h-7 rounded-xl border-2 transition-all flex items-center justify-center ${
              acceptedTerms 
                ? "bg-maroon-700 border-maroon-700 shadow-xl shadow-maroon-700/20" 
                : "bg-white border-slate-200 group-hover:border-maroon-700/40"
            }`}>
              {acceptedTerms && <CheckSquare className="w-4 h-4 text-white" />}
            </div>
          </div>
          <span className="text-[11px] font-black text-slate-400 leading-relaxed uppercase tracking-widest pt-1">
             Verify shared details accuracy. Identity mismatch with Student Credentials results in Entry Revocation.
          </span>
        </label>
        {errors.terms && (
          <p className="text-[10px] font-black text-red-500 flex items-center gap-1.5 pl-11 uppercase tracking-[0.2em]">
            <AlertCircle className="w-3 h-3" />
            Consent Required
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-5 rounded-2xl text-lg font-black tracking-tight shadow-2xl shadow-maroon-700/20 group hover:-translate-y-1 transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                <span className="uppercase tracking-widest text-sm">Validating Record...</span>
            </div>
          ) : (
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Request Official Ticket</span>
             </div>
          )}
        </button>
      </div>
    </form>
  );
}
