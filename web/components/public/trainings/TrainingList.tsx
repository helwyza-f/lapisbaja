// components/public/trainings/TrainingList.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TrainingFilter from "./TrainingFilter";
import TrainingCard from "./TrainingCard";
import { Training } from "@/lib/types";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingListProps {
  initialData: Training[];
  meta: any; // Menerima metadata dari backend
  currentPage: number;
}

export default function TrainingList({
  initialData,
  meta,
  currentPage,
}: TrainingListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  // Client-side filtering tetap dipertahankan untuk kategori
  const filteredTrainings =
    activeCategory === "all"
      ? initialData
      : initialData.filter(
          (t) => t.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    // Scroll true karena ini ganti halaman katalog
    router.push(`/trainings?${params.toString()}`, { scroll: true });
  };

  const totalPages = meta?.total_page || 1;

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <TrainingFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {filteredTrainings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredTrainings.map((training) => (
              <TrainingCard key={training.id} data={training} />
            ))}
          </div>

          {/* INDUSTRIAL PAGINATION CONTROLS */}
          <div className="pt-16 flex items-center justify-center gap-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-950 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all duration-300 shadow-sm active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex flex-col items-center">
              <div className="px-8 py-3 bg-slate-950 rounded-2xl text-white font-black text-[12px] uppercase tracking-[0.3em] italic shadow-xl shadow-slate-900/20">
                Page {currentPage.toString().padStart(2, "0")}
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Total {meta?.total_page || 1} Pages Available
              </p>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-950 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all duration-300 shadow-sm active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-40 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-slate-200" strokeWidth={1} />
          <div className="space-y-1">
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">
              CATALOG_EMPTY_IN_THIS_SECTOR
            </p>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
              Gunakan filter lain atau kembali ke halaman utama.
            </p>
          </div>
          {(currentPage > 1 || activeCategory !== "all") && (
            <button
              onClick={() => {
                setActiveCategory("all");
                handlePageChange(1);
              }}
              className="mt-6 px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
