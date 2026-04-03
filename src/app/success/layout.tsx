import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Successful | অন্তরীপ ২১ Farewell Concert 2026",
  description: "Your ticket has been generated. Download your entry pass and check your email for confirmation.",
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

