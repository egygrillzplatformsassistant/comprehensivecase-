import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Sora, Cairo } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASU Dentistry — Comprehensive Case Packages",
  description:
    "Photography, editing & presentation-ready packages for comprehensive cases. Student prices for Batch 2026 — Ain Shams University, Faculty of Dentistry.",
  metadataBase: new URL("https://example.com"),
  icons: { icon: "/tooth.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-dvh">{children}</body>
    </html>
  );
}
