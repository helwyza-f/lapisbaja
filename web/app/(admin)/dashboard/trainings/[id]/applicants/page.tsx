// app/(admin)/dashboard/trainings/[id]/applicants/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import RegistrationsTable from "@/components/admin/RegistrationsTable";
import { ArrowLeft, Users, GraduationCap } from "lucide-react";

export default function TrainingApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* HEADER NAV */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8 gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center h-12 w-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-950 transition-all active:scale-90"
          >
            <ArrowLeft
              className="text-slate-400 group-hover:text-white transition-colors"
              size={20}
            />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary font-black text-[9px] uppercase tracking-[0.4em]">
              <Users size={12} /> Participant Analysis
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              PROGRAM <span className="text-slate-300">APPLICANTS.</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <GraduationCap className="text-slate-400" size={20} />
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Filtering by Program ID
            </p>
            <p className="text-xs font-mono font-bold text-slate-600 tracking-tighter uppercase">
              {id}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      {/* Kita oper training_id via initialFilters agar RegistrationsTable otomatis nge-fetch pendaftar di training ini aja */}
      <div className="bg-slate-50/50 p-4 rounded-[2rem]">
        <RegistrationsTable initialFilters={{ training_id: id }} />
      </div>
    </div>
  );
}
