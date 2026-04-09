// components/public/trainings/TrainingDetail.tsx
import { Training } from "@/lib/types";
import { Calendar, Tag, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function TrainingDetail({ data }: { data: Training }) {
  const formattedDate = data.date_start
    ? new Date(data.date_start).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "TBA";

  return (
    <div className="space-y-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Calendar className="text-primary" />,
            label: "Schedule",
            value: formattedDate,
          },
          {
            icon: <Tag className="text-primary" />,
            label: "Investment",
            value: `Rp ${data.price?.toLocaleString("id-ID")}`,
          },
          {
            icon: <MapPin className="text-primary" />,
            label: "Location",
            value: "Batam Center / On-Site",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              {item.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
              <p className="text-sm font-black text-slate-900 uppercase italic">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Description & Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight">
              About This Program
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {data.description ||
                "Program pelatihan intensif yang dirancang untuk membekali tenaga profesional dengan standar inspeksi teknis terbaru."}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight">
              Technical Syllabus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Surface Preparation Standard SA 2.5",
                "Wet & Dry Film Thickness Measurement",
                "Technical Data Sheet (TDS) Interpretation",
                "Adhesion & Holiday Testing Methods",
                "Quality Control Reporting & ITP",
                "International Standards Compliance (NACE/SSPC)",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl"
                >
                  <CheckCircle2 size={18} className="text-primary mt-0.5" />
                  <span className="text-sm font-bold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4">
          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white space-y-6 sticky top-24">
            <h4 className="text-xl font-black uppercase italic text-primary">
              Requirement
            </h4>
            <ul className="space-y-4 text-xs font-medium text-slate-400 italic">
              <li>• Safety Shoes & Workwear (Internal Practice)</li>
              <li>• Basic Technical Background</li>
              <li>• ID Card / Passport for Certification</li>
            </ul>
            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Certification By
              </p>
              <p className="text-sm font-bold text-white uppercase tracking-tighter">
                PT Lapis Baja Inspektindo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
