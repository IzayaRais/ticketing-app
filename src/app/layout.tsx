import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import InstituteGate from "@/components/InstituteGate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://antorip.vercel.app";
const ogImage = "/og-image.jpg";

export const metadata: Metadata = {
  title: {
    default: "অন্তরীপ ২১ Farewell Concert 2026",
    template: "%s | অন্তরীপ ২১ Farewell Concert",
  },
  description: "Secure registration and ticketing for the অন্তরীপ ২১ Farewell Concert - April 09, 2026 at MIST Central Field.",
  keywords: ["অন্তরীপ ২১", "Farewell Concert", "MIST", "2026", "Event Ticketing", "Dhaka"],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "অন্তরীপ ২১ Farewell Concert 2026",
    title: "অন্তরীপ ২১ Farewell Concert 2026",
    description: "One final night of music and legacy. April 09, 2026 at MIST Central Field.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "অন্তরীপ ২১ Farewell Concert 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "অন্তরীপ ২১ Farewell Concert 2026",
    description: "One final night of music and legacy. April 09, 2026 at MIST Central Field.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import RegistrationCountdownOverlay from "@/components/RegistrationCountdownOverlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <InstituteGate />
          <RegistrationCountdownOverlay />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

