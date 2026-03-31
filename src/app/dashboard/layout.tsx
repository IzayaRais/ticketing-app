import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Antorip Farewell Concert 2026",
  description: "Access your ticket and manage your registration for the Antorip Farewell Concert.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
