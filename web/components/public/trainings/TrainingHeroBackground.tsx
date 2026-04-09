// components/public/trainings/TrainingHeroBackground.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TrainingHeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-slate-950" />

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/images/home/gambar1-1600x1200.jpeg"
          alt="Technical Training Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gelapkan overlay agar teks putih kontras tajam di mobile & desktop */}
      <div className="absolute inset-0 bg-slate-950/30 z-10" />

      {/* Gradient Bottom: Ganti ke arah hitam, BUKAN putih */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950 z-20" />

      {/* Pattern halus dipertegas sedikit */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-30"
        style={{
          backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}
