// components/public/trainings/TrainingFilter.tsx
"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

const categories = [
  { id: "all", name: "All Programs" },
  { id: "coating", name: "Coating Inspection" },
  { id: "welding", name: "Welding" },
  { id: "ndt", name: "NDT Testing" },
  { id: "safety", name: "Industrial Safety" },
];

interface TrainingFilterProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export default function TrainingFilter({
  activeCategory,
  setActiveCategory,
}: TrainingFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mb-12">
      {/* Container Scroll: 
         - Mobile: flex-nowrap + overflow-x-auto (Slide ke kanan)
         - Desktop: justify-center (Tetap rapi di tengah)
      */}
      <div
        ref={scrollRef}
        className="flex items-center lg:justify-center gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Spacer untuk mobile agar tidak mepet layar saat scroll di awal */}
        <div className="min-w-[2px] lg:hidden" />

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all border duration-300",
              activeCategory === cat.id
                ? "bg-primary border-primary text-white shadow-[0_10px_20px_rgba(245,101,35,0.2)] scale-105 z-10"
                : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:text-primary active:scale-95",
            )}
          >
            {cat.name}
          </button>
        ))}

        {/* Spacer untuk mobile agar tidak mepet layar saat scroll di akhir */}
        <div className="min-w-[16px] lg:hidden" />
      </div>

      {/* Fade Effect Mobile: Memberikan visual hint kalau ada konten di kanan */}
      <div className="lg:hidden absolute top-0 right-0 h-[42px] w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <div className="lg:hidden absolute top-0 left-0 h-[42px] w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
    </div>
  );
}
