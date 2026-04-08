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

export const metadata: Metadata = {
  title: "CMS Lapis Baja | Admin Panel",
  description: "Sistem Manajemen Sertifikasi PT Lapis Baja Inspektindo",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full bg-slate-50 text-slate-900`}
      >
        {/* Main Content Render */}
        {children}

        {/* Global Notification System */}
        <Toaster
          richColors
          position="top-right"
          closeButton
          expand={false}
          theme="light"
        />
      </body>
    </html>
  );
}
