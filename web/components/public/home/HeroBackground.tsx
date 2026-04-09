// components/public/home/HeroBackground.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  "/images/home/gambar1-1600x1200.jpeg",
  "/images/home/gambar2-1600x1200.jpeg",
  "/images/home/gambar3-1600x1200.jpeg",
  "/images/home/gambar4-1600x1200.jpeg",
  "/images/home/gambar5-1280x960.jpeg",
];

export default function HeroBackground() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[current]}
            alt="Industrial Inspection Activity"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients tetep di sini biar nyatu sama background */}
      <div className="absolute inset-0 bg-slate-950/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/40 lg:to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-10" />
    </div>
  );
}
