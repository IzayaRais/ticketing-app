import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import InstituteGate from "@/components/InstituteGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://antorip.vercel.app";
const ogImage = "/og-image.jpg";

export const metadata: Metadata = {
  title: {
    default: "Antorip Farewell Concert 2026",
    template: "%s | Antorip Farewell Concert",
  },
  description: "Secure registration and ticketing for the Antorip Farewell Concert — April 09, 2026 at MIST Central Field.",
  keywords: ["Antorip", "Farewell Concert", "MIST", "2026", "Event Ticketing", "Dhaka"],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Antorip Farewell Concert 2026",
    title: "Antorip Farewell Concert 2026",
    description: "One final night of music and legacy. April 09, 2026 at MIST Central Field.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Antorip Farewell Concert 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antorip Farewell Concert 2026",
    description: "One final night of music and legacy. April 09, 2026 at MIST Central Field.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <InstituteGate />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
