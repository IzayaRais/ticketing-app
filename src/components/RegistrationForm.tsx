"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationData } from "@/lib/validations";
import { institutes } from "@/lib/validations";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertCircle, CheckCircle2,
  ArrowRight, Send, ChevronDown, X
} from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;
const genders = ["Male", "Female", "Other"] as const;

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`relative ${open ? "z-50" : "z-auto"}`} ref={ref}>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 bg-white ${
          open
            ? "border-maroon-700 ring-4 ring-maroon-700/8 shadow-lg"
            : error
              ? "border-red-300 focus:border-red-400"
              : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        <span className="text-maroon-700 flex-shrink-0">{icon}</span>
        <span className={`flex-1 text-sm font-medium ${value ? "text-slate-800" : "text-slate-400"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                value === opt
                  ? "bg-maroon-50 text-maroon-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs font-medium text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

export default function RegistrationForm({ onSuccess }: { onSuccess?: (ticketId: string, email: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-animate]");
    items.forEach((item, i) => {
      (item as HTMLElement).style.setProperty("--delay", `${i * 60}ms`);
    });
  }, [step]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { terms: false },
  });

  const acceptedTerms = watch("terms");
  const university = watch("university");
  const gender = watch("gender");
  const bloodGroup = watch("bloodGroup");

  const onSubmit = useCallback(async (data: RegistrationData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      setSuccess(true);

      if (onSuccess) {
        onSuccess(result.ticketId, result.email);
      } else {
        setTimeout(() => {
          router.push(`/success?id=${result.ticketId}&email=${result.email}`);
        }, 1500);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setIsSubmitting(false);
    }
  }, [onSuccess, router]);

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">You&apos;re In!</h3>
        <p className="text-sm text-slate-400">Your ticket is being generated...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" ref={formRef}>
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50/80 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
          <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[0, 1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-maroon-700" : "bg-slate-100"}`} />
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              {...register("fullName")}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="Enter your full name"
              autoFocus
            />
            {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.fullName.message}</p>}
          </div>

          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="your.email@university.edu"
            />
            {errors.email && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.email.message}</p>}
          </div>

          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="+880 1XXXXXXXXX"
            />
            {errors.phone && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.phone.message}</p>}
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-maroon-700 text-white rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-colors duration-200 mt-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Academic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              Student ID
            </label>
            <input
              {...register("studentId")}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="Your Student ID"
              autoFocus
            />
            {errors.studentId && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.studentId.message}</p>}
          </div>

          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <SelectField
              label="University"
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
              value={university}
              onChange={(val) => setValue("university", val as "MIST" | "BUP" | "AFMC", { shouldValidate: true })}
              options={institutes}
              placeholder="Select your university"
              error={errors.university?.message}
            />
          </div>

          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <SelectField
              label="Gender"
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              value={gender}
              onChange={(val) => setValue("gender", val as "Male" | "Female" | "Other", { shouldValidate: true })}
              options={genders}
              placeholder="Select gender"
              error={errors.gender?.message}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-maroon-700 text-white rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details & Submit */}
      {step === 2 && (
        <div className="space-y-4">
          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)]">
            <SelectField
              label="Blood Group"
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>}
              value={bloodGroup}
              onChange={(val) => setValue("bloodGroup", val, { shouldValidate: true })}
              options={bloodGroups as unknown as string[]}
              placeholder="Select blood group"
              error={errors.bloodGroup?.message}
            />
          </div>

          <div data-animate className="opacity-0 animate-[fadeInUp_0.4s_ease_forwards] [animation-delay:var(--delay)] pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="peer sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                  acceptedTerms
                    ? "bg-maroon-700 border-maroon-700"
                    : "bg-white border-slate-200 group-hover:border-slate-300"
                }`}>
                  {acceptedTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <span className="text-sm text-slate-500 leading-relaxed">
                I confirm all information is accurate and agree to the <span className="text-maroon-700 font-semibold">terms and conditions</span>.
              </span>
            </label>
            {errors.terms && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.terms.message}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !acceptedTerms}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-maroon-700 text-white rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><Send className="w-4 h-4" /> Register</>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
