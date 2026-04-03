import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Sign in to access your ticket dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

