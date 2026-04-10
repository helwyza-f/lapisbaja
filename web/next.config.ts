// web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // FIX: Izinkan HTTP (karena src error kamu pakai http)
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // IZINKAN HTTPS & WILDCARD untuk subdomain google lainnya
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // Konfigurasi untuk Cloudflare R2 PT Lapis Baja [cite: 7, 101]
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-test.bookinaja.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
