import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Admin panel for managing event registrations and attendee data.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

