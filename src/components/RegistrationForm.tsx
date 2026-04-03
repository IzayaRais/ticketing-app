"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationData } from "@/lib/validations";
import { institutes } from "@/lib/validations";
import Image from "next/image";
import {
  paymentMethodOptions,
  PAYMENT_NUMBER,
  SELECTED_INSTITUTE_KEY,
  type Institute,
} from "@/lib/institute";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertCircle, CheckCircle2,
  ArrowRight, Send, ChevronDown, X
} from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;
const genders = ["Male", "Female"] as const;

const SelectField = memo(function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border text-sm font-medium outline-none transition-all duration-200 bg-white cursor-pointer ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-400/8"
              : "border-slate-200/80 hover:border-slate-300 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
          } ${value ? "text-slate-800" : "text-slate-400"}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs font-medium text-red-500 mt-1.5">{error}</p>}
    </div>
  );
});

export default function RegistrationForm({ onSuccess }: { onSuccess?: (ticketId: string, email: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [copiedPaymentNumber, setCopiedPaymentNumber] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { terms: false },
  });

  const university = watch("university");
  const requiresPayment = university === "BUP" || university === "AFMC";

  useEffect(() => {
    const syncInstitute = () => {
      const stored = sessionStorage.getItem(SELECTED_INSTITUTE_KEY) as Institute | null;
      if (stored && institutes.includes(stored)) {
        setSelectedInstitute(stored);
        setValue("university", stored, { shouldDirty: true });
      }
    };

    syncInstitute();
    window.addEventListener("selectedInstituteChanged", syncInstitute);
    return () => window.removeEventListener("selectedInstituteChanged", syncInstitute);
  }, [setValue]);

  useEffect(() => {
    if (!requiresPayment) {
      setValue("paymentMethod", undefined);
      setValue("transactionId", "");
      setValue("paymentFromNumber", "");
    }
  }, [requiresPayment, setValue]);

  const onSubmit = useCallback(async (data: RegistrationData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RegistrationData = {
        ...data,
        university: selectedInstitute || data.university,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
  }, [onSuccess, router, selectedInstitute]);

  const copyPaymentNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER);
      setCopiedPaymentNumber(true);
      setTimeout(() => setCopiedPaymentNumber(false), 1500);
    } catch {
      setCopiedPaymentNumber(false);
    }
  }, []);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("university")} />
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
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-maroon-700" : "bg-slate-100"}`} />
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
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

          <div>
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

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="8801XXXXXXXXX or 01XXXXXXXXX"
            />
            {errors.phone && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.phone.message}</p>}
          </div>

          <button
            type="button"
            onClick={async () => {
              const ok = await trigger(["fullName", "email", "phone"]);
              if (ok) setStep(1);
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-maroon-700 text-white rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-colors duration-200 mt-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Academic + Health Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Student ID</label>
            <input
              {...register("studentId")}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
              placeholder="Your Student ID"
              autoFocus
            />
            {errors.studentId && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.studentId.message}</p>}
          </div>

          {selectedInstitute ? (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                Institute
              </label>
              <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-slate-50 text-sm font-bold text-slate-800">
                {selectedInstitute}
              </div>
              {errors.university && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.university.message}</p>}
            </div>
          ) : (
            <SelectField
              label="University"
              value={getValues("university") || ""}
              onChange={(val) => setValue("university", val as "MIST" | "BUP" | "AFMC", { shouldDirty: true })}
              options={institutes}
              placeholder="Select your university"
              error={errors.university?.message}
            />
          )}

          <SelectField
            label="Gender"
            value={getValues("gender") || ""}
            onChange={(val) => setValue("gender", val as "Male" | "Female", { shouldDirty: true })}
            options={genders}
            placeholder="Select gender"
            error={errors.gender?.message}
          />

          <SelectField
            label="Blood Group"
            value={getValues("bloodGroup") || ""}
            onChange={(val) => setValue("bloodGroup", val, { shouldDirty: true })}
            options={bloodGroups as unknown as string[]}
            placeholder="Select blood group"
            error={errors.bloodGroup?.message}
          />

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
              onClick={async () => {
                const ok = await trigger(["studentId", "university", "gender", "bloodGroup"]);
                if (ok) setStep(2);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-maroon-700 text-white rounded-xl font-semibold text-sm hover:bg-maroon-800 transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment / Confirmation */}
      {step === 2 && (
        <div className="space-y-4">
          {requiresPayment && (
            <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="pb-1 border-b border-amber-200/70">
                <p className="text-base font-black text-slate-800">Payment Page</p>
                <p className="text-xs text-slate-500">Complete payment details to finish registration.</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700 mb-1">
                  Payment Required ({university})
                </p>
                <p className="text-sm text-slate-600">
                  Payment amount: <span className="font-bold">100tk</span>.
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Send payment via bKash or Nagad to{" "}
                  <button
                    type="button"
                    onClick={copyPaymentNumber}
                    className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-0.5 font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                    title="Copy payment number"
                  >
                    {PAYMENT_NUMBER}
                    <span className="text-[10px] font-semibold text-amber-700">{copiedPaymentNumber ? "Copied" : "Copy"}</span>
                  </button>
                  , then enter your transaction ID.
                </p>
                <p className="text-xs font-semibold text-red-700 mt-2">
                  Warning: Duplicate or fake transaction IDs will invalidate your ticket and the registration will be deleted automatically.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethodOptions.map((method) => {
                    const active = getValues("paymentMethod") === method;
                    const isBkash = method === "BKASH";
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setValue("paymentMethod", method, { shouldDirty: true })}
                        className={`rounded-xl border p-3 flex items-center gap-3 text-left transition-all ${
                          active
                            ? "border-maroon-700 bg-white shadow-sm"
                            : "border-slate-200 bg-white/80 hover:border-slate-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <Image
                            src={isBkash ? "/payments/bkash.png" : "/payments/nagad.webp"}
                            alt={method}
                            width={28}
                            height={28}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{isBkash ? "bKash" : "Nagad"}</p>
                          <p className="text-xs text-slate-500">Tap to select</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.paymentMethod && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.paymentMethod.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                  Transaction ID
                </label>
                <input
                  {...register("transactionId")}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
                  placeholder="Enter your bKash/Nagad transaction ID"
                />
                {errors.transactionId && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.transactionId.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                  Payment Done From Number
                </label>
                <input
                  {...register("paymentFromNumber")}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-maroon-700 focus:ring-4 focus:ring-maroon-700/8"
                  placeholder="8801XXXXXXXXX or 01XXXXXXXXX"
                />
                {errors.paymentFromNumber && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.paymentFromNumber.message}</p>}
              </div>
            </div>
          )}

          {!requiresPayment && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-base font-black text-slate-800">Final Step</p>
              <p className="text-sm text-slate-600 mt-1">No payment is required for MIST. Review and submit your registration.</p>
            </div>
          )}

          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white flex items-center justify-center peer-checked:bg-maroon-700 peer-checked:border-maroon-700 transition-all group-hover:border-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <span className="text-sm text-slate-500 leading-relaxed">
                I confirm all information is accurate and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms((prev) => !prev)}
                  className="text-maroon-700 font-semibold underline underline-offset-2 hover:text-maroon-800"
                >
                  terms and conditions
                </button>.
              </span>
            </label>
            {errors.terms && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.terms.message}</p>}
            {showTerms && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Sample Terms & Conditions</p>
                <p>1. Every registration is for one person only and cannot be transferred.</p>
                <p>2. Your ticket may be cancelled if submitted information or payment proof is invalid.</p>
                <p>3. Entry requires original student ID and valid ticket verification at the gate.</p>
                <p>4. Gates open at 1:00 PM. Please arrive early to avoid queue delays.</p>
                <p>5. Event authority may deny entry for misconduct or safety violations.</p>
              </div>
            )}
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
              disabled={isSubmitting}
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

