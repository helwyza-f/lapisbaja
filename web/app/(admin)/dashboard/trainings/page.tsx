// app/(admin)/dashboard/trainings/page.tsx
"use client";

import { Plus, BookOpen, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrainingsTable from "@/components/admin/TrainingsTable";
import { useRouter } from "next/navigation";

export default function TrainingsPage() {
  const router = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[9px] uppercase tracking-[0.3em]">
            <BookOpen size={14} /> Program Catalog
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            TRAINING <span className="text-slate-400">MANAGEMENT.</span>
          </h1>
        </div>

        <Button
          onClick={() => router.push("/dashboard/trainings/new")}
          className="h-12 px-6 bg-slate-950 text-white hover:bg-primary font-black uppercase italic tracking-widest text-[10px] transition-all rounded-md shadow-lg shadow-slate-950/20 gap-3"
        >
          <Plus size={16} /> Create New Program
        </Button>
      </div>

      <TrainingsTable />
    </div>
  );
}
