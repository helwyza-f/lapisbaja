import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata dengan Title & Description PT Lapis Baja
export const metadata: Metadata = {
  title: "PT Lapis Baja Inspektindo | Coating & Welding Inspection Training",
  description:
    "Pusat pelatihan dan sertifikasi inspeksi teknis terkemuka di Batam. Spesialis Blasting, Painting, dan Welding Inspection.",
  // Kita biarkan Next.js mendeteksi favicon.ico, apple-touch-icon.png,
  // dan manifest secara otomatis dari folder app.
  // Tapi kita tambahkan fallback manual agar lebih "bulletproof"
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full bg-white text-slate-900`}
      >
        {children}
        <Toaster richColors position="top-center" closeButton theme="light" />
      </body>
    </html>
  );
}
