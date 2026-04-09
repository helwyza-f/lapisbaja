// app/(admin)/dashboard/trainings/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import TrainingForm from "@/components/admin/TrainingForm";
import { ArrowLeft, Loader2, Edit3, Settings2 } from "lucide-react";
import { toast } from "sonner";

export default function EditTrainingPage() {
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
      toast.error(
        "DATA_ERR: Resource specifications not found in this sector.",
      );
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
          Fetching Program Data Integrity...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center h-14 w-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-950 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft
              className="text-slate-400 group-hover:text-white transition-colors"
              size={24}
            />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary font-black text-[9px] uppercase tracking-[0.3em]">
              <Settings2 size={12} /> Configuration Mode
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              EDIT <span className="text-slate-300">SPECS.</span>
            </h1>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
            PROGRAM_REF_ID
          </p>
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
            {data?.id}
          </p>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />

        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-3">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest italic">
              Overwrite Technical Parameters
            </p>
          </div>

          {/* Panggil TrainingForm dengan initialData */}
          <TrainingForm initialData={data} />
        </div>
      </div>

      {/* FOOTER LOGO/TEXT */}
      <div className="flex items-center justify-center gap-4 py-6 grayscale opacity-20 transition-opacity hover:opacity-40">
        <Edit3 size={16} />
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">
          Industrial Registry Modification System v2.4
        </p>
      </div>
    </div>
  );
}
