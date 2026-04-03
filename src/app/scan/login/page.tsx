"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ScannerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("scanner-credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid scanner email or password.");
      return;
    }
    router.push("/scan");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Scanner Login</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in with assigned scanner credentials.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="scanner@email.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-maroon-700"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-maroon-700"
            required
          />
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-maroon-700 text-white font-bold hover:bg-maroon-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-5">
          Need access? Ask admin to create a scanner account from admin dashboard.
        </p>
        <Link href="/" className="inline-block mt-4 text-sm text-maroon-700 font-semibold hover:underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
