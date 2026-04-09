// app/(admin)/dashboard/trainings/new/page.tsx
import TrainingForm from "@/components/admin/TrainingForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTrainingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/trainings"
          className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">
            NEW <span className="text-slate-400">PROGRAM.</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Add training catalog entry
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm">
        <TrainingForm />
      </div>
    </div>
  );
}
