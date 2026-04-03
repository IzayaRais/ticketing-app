import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gate Scanner | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Scan attendee QR codes for entry verification.",
  robots: "noindex, nofollow",
};

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

