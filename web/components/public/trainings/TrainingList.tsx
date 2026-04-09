// components/public/trainings/TrainingList.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TrainingFilter from "./TrainingFilter";
import TrainingCard from "./TrainingCard";
import { Training } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TrainingListProps {
  initialData: Training[];
  currentPage: number;
}

export default function TrainingList({
  initialData,
  currentPage,
}: TrainingListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTrainings =
    activeCategory === "all"
      ? initialData
      : initialData.filter(
          (t) => t.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/trainings?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-12">
      <TrainingFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {filteredTrainings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrainings.map((training) => (
              <TrainingCard key={training.id} data={training} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="px-6 py-2 bg-slate-900 rounded-full text-white font-black text-[10px] uppercase tracking-widest italic">
              Page {currentPage}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={initialData.length < 9} // Jika data kurang dari limit, berarti page terakhir
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
            Tidak ada program pelatihan di kategori ini.
          </p>
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(1)}
              className="mt-4 text-primary font-black text-[10px] uppercase underline"
            >
              Back to first page
            </button>
          )}
        </div>
      )}
    </div>
  );
}
