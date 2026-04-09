// components/public/home/HeroContent.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dynamicTexts = [
  {
    sub: "Supply, Qualify, and Certify Inspection Personnel in Coating and NDT.",
  },
  {
    sub: "International Standards for NACE, SSPC, and ISO Qualifications.",
  },
  {
    sub: "Maintaining accuracy and reliability in project specifications.",
  },
];

export default function HeroContent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === dynamicTexts.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl h-[80px] md:h-[100px] flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <p className="text-lg md:text-xl lg:text-2xl text-slate-100 font-bold leading-tight uppercase italic border-l-2 border-primary pl-4">
            {dynamicTexts[index].sub}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
