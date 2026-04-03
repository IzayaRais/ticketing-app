import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Access your ticket and manage your registration for the অন্তরীপ ২১ Farewell Concert.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

