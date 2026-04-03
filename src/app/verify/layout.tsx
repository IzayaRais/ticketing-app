import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Ticket | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Verify your entry pass for the অন্তরীপ ২১ Farewell Concert.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

