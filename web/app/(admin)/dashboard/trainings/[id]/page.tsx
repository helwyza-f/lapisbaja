// app/(admin)/dashboard/trainings/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Users,
  Edit3,
  Calendar as CalendarIcon,
  Wallet,
  FileText,
  ChevronRight,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TrainingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trainings/${id}`);
      setData(res.data?.data);
    } catch (err) {
      toast.error("ERROR: Industrial program specs not found.");
      router.push("/dashboard/trainings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-slate-900" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          Syncing Technical Assets...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      {/* --- TOP NAVIGATION & ACTIONS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/dashboard/trainings")}
            className="group flex items-center justify-center h-12 w-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-950 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft
              className="text-slate-400 group-hover:text-white transition-colors"
              size={20}
            />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary font-black text-[9px] uppercase tracking-[0.4em]">
              <Database size={12} /> Resource Master
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              PROGRAM <span className="text-slate-300">OVERVIEW.</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/dashboard/trainings/${id}/edit`)}
            variant="outline"
            className="h-12 px-6 border-slate-200 font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl hover:bg-slate-50 transition-all"
          >
            <Edit3 size={14} /> Edit Specs
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/trainings/${id}/applicants`)}
            className="h-12 px-6 bg-slate-950 text-white hover:bg-primary font-black uppercase italic tracking-widest text-[10px] gap-2 rounded-xl shadow-xl shadow-slate-950/20 active:scale-95 transition-all"
          >
            <Users size={14} /> View Applicants
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- MAIN CONTENT: SPECS --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
              <FileText size={280} />
            </div>

            <div className="space-y-12 relative z-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">
                  Identity Log // 01
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.85] max-w-2xl">
                  {data.title}
                </h2>
                <div className="inline-flex px-3 py-1 bg-slate-50 border border-slate-100 rounded-md font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  UID: {data.id}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                  <FileText size={14} className="text-slate-300" /> Technical
                  Syllabus & Scope
                </p>
                <div className="bg-slate-50/40 rounded-[2rem] p-10 border border-slate-100/50 shadow-inner">
                  <p className="text-slate-600 font-medium leading-relaxed italic whitespace-pre-wrap text-sm lg:text-base">
                    {data.description ||
                      "No technical description provided for this sector."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SIDEBAR: LOGISTICS --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* Investment & Schedule Card */}
          <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <BookOpen size={200} />
            </div>

            <div className="space-y-10 relative z-10">
              <div className="space-y-3">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  Resource Value
                </p>
                <div className="flex items-center gap-3">
                  <Wallet className="text-primary" size={24} />
                  <p className="text-3xl font-black italic tracking-tighter text-white leading-none">
                    IDR {data.price?.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-8 border-t border-white/5">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  Active Schedule
                </p>
                <div className="flex items-center gap-4">
                  <CalendarIcon className="text-primary" size={22} />
                  <p className="text-xl font-black uppercase italic tracking-tight text-slate-100 leading-none">
                    {data.date_start
                      ? format(new Date(data.date_start), "eeee, dd MMM yyyy")
                      : "NOT SCHEDULED"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTION: MANAGE APPLICANTS */}
          <button
            onClick={() => router.push(`/dashboard/trainings/${id}/applicants`)}
            className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex items-center justify-between group hover:border-slate-950 hover:shadow-xl transition-all active:scale-95 duration-500"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                <Users size={28} />
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                  Applicant Control
                </p>
                <p className="text-xl font-black text-slate-900 uppercase italic leading-none">
                  Manage Registry
                </p>
              </div>
            </div>
            <ChevronRight
              className="text-slate-300 group-hover:text-slate-950 group-hover:translate-x-2 transition-all duration-500"
              size={24}
            />
          </button>

          <div className="px-10 opacity-30">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 text-center leading-relaxed">
              Industrial Grade Registry Access // PT Lapis Baja Inspektindo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
