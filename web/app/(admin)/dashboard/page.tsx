// app/(admin)/dashboard/page.tsx
import { cn } from "@/lib/utils";
import { Users, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Registrations",
    value: "128",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active Trainings",
    value: "12",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Completed Jobs",
    value: "45",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Rev. Growth",
    value: "+12%",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">
          Overview.
        </h1>
        <p className="text-slate-500 font-medium italic text-sm">
          Monitor seluruh aktivitas pendaftaran dan pelatihan secara real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <div className="mt-6 space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </h3>
              <p className="text-3xl font-black text-slate-950 italic tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section placeholder buat chart atau recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 h-80 flex items-center justify-center">
          <p className="text-slate-300 font-black uppercase italic tracking-widest text-[10px]">
            Activity Chart Placeholder
          </p>
        </div>
        <div className="bg-slate-950 rounded-[2.5rem] p-8 h-80 flex flex-col justify-between">
          <h3 className="text-white font-black uppercase italic tracking-widest text-xs">
            Security Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-500">Encryption</span>
              <span className="text-emerald-500">Active</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
