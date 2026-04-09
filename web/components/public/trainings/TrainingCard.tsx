// components/public/trainings/TrainingCard.tsx
import { Training } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, MapPin } from "lucide-react";

export default function TrainingCard({ data }: { data: Training }) {
  // Format tanggal aman jika date_start tidak ada (fallback ke hari ini)
  const formattedDate = data.date_start
    ? new Date(data.date_start).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBA";

  return (
    <div className="group relative bg-white border border-slate-100 p-6 hover:border-primary/20 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-[0_20px_40px_rgba(245,101,35,0.08)] rounded-[2rem] overflow-hidden">
      {/* Badge Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Registration Open
        </div>
        <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest">
          {data.category || "General"}
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {data.title}
        </h3>
        <p className="text-slate-500 text-[11px] line-clamp-2 font-medium leading-relaxed italic">
          {data.description ||
            "Program pelatihan sertifikasi kompetensi teknis berstandar internasional."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto space-y-4 pt-5 border-t border-slate-50">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={12} className="text-primary/60" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin size={12} className="text-primary/60" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              Batam Center
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Investment
            </span>
            <span className="text-base font-black text-slate-950 italic tracking-tighter">
              Rp {data.price?.toLocaleString("id-ID") || "0"}
            </span>
          </div>

          <Button
            size="sm"
            className="bg-slate-950 hover:bg-primary text-white rounded-full group/btn px-4"
            asChild
          >
            <Link href={`/trainings/${data.id}`}>
              <ArrowRight
                size={16}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
