// app/projects/page.tsx
import {
  Building2,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Globe,
} from "lucide-react";
import ProjectHeader from "@/components/public/projects/ProjectHeader";

const projects = [
  {
    client: "PT IEG Oilfield Indonesia",
    project: "Third Party Coating Inspection",
    endClient: "PT Baker Hughes & PT Cameron",
    desc: "Menyediakan NACE Coating Inspector Level 3 profesional untuk memastikan integritas dan kepatuhan standar internasional pada seluruh peralatan oilfield proyek strategis.",
    tag: "Technical Inspection",
  },
  {
    client: "PT Cladtek",
    project: "Rework Coating Activity",
    location: "Luwuk, Indonesia (Tomori Project)",
    desc: "Manajemen tenaga kerja ahli untuk restorasi dan perbaikan sistem coating pada Concrete Weight Coating (CWC), 3LPP, hingga FBE dengan presisi tinggi.",
    tag: "Manpower & Rework",
  },
  {
    client: "Vector / Jeneric Jaya / KCC Paint",
    project: "Inspection Tools Supply",
    desc: "Distribusi instrumen inspeksi teknis bersertifikasi kepada mitra industri global guna mendukung akurasi pengukuran di lingkungan kerja yang ekstrem.",
    tag: "Equipment Supply",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white pb-24 selection:bg-primary selection:text-white">
      {/* 1. Header Area - Tetap Clean & Industrial */}
      <ProjectHeader />

      {/* 2. Projects List - Mobile First & Responsive Grid */}
      <section className="py-16 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 md:gap-16">
            {projects.map((p, i) => (
              <div
                key={i}
                className="group relative bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-slate-100 transition-all duration-700 hover:bg-slate-950 hover:translate-y-[-8px] overflow-hidden shadow-sm hover:shadow-2xl"
              >
                {/* Background Pattern - Muncul Saat Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="flex flex-col lg:flex-row gap-10 md:gap-12 relative z-10">
                  {/* Left: Detail Proyek */}
                  <div className="lg:w-2/3 space-y-6 md:space-y-8">
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <span className="px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                        {p.tag}
                      </span>
                      {p.location && (
                        <span className="px-4 py-1.5 bg-white/10 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10 flex items-center gap-2 group-hover:text-white group-hover:border-white/20 transition-all">
                          <MapPin size={10} /> {p.location}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <h2 className="text-3xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter group-hover:text-white transition-colors leading-none">
                        {p.project}
                      </h2>
                      <div className="flex items-center gap-3 text-primary font-black text-xs md:text-base uppercase italic">
                        <Building2 className="shrink-0" size={20} /> {p.client}
                      </div>
                    </div>

                    <p className="text-slate-500 group-hover:text-slate-400 font-medium italic leading-relaxed text-sm md:text-xl max-w-2xl">
                      {p.desc}
                    </p>

                    {p.endClient && (
                      <div className="pt-6 md:pt-8 border-t border-slate-200 group-hover:border-white/10 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          End-User Project:
                        </p>
                        <p className="text-xs md:text-sm font-black text-slate-950 group-hover:text-white uppercase italic tracking-wide">
                          {p.endClient}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Status Visual - Disederhanakan di Mobile */}
                  <div className="lg:w-1/3 flex flex-row lg:flex-col justify-between lg:justify-end items-center lg:items-end gap-6 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-200 group-hover:border-white/10 transition-colors">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center group-hover:bg-primary group-hover:rotate-6 transition-all duration-500">
                        <ShieldCheck
                          className="text-primary group-hover:text-white"
                          size={32}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-950 rounded-full hidden md:flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Project Integrity
                      </p>
                      <p className="text-xl md:text-3xl font-black text-slate-950 group-hover:text-white uppercase italic tracking-tighter">
                        SUCCESSFUL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Footer Philosophy - Dark Industrial Version */}
      <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
        {/* Background Pattern: Halus & Teknis */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Aksen Cahaya Oranye Tipis di Pojok */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Mini Label */}
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="h-px w-6 bg-primary/40" />
              <span className="text-primary font-black uppercase text-[9px] tracking-[0.4em]">
                Technical Commitment
              </span>
              <div className="h-px w-6 bg-primary/40" />
            </div>

            {/* Main Statement: White & Primary */}
            <h3 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              WE COMPLY WITH YOUR <br />
              <span className="text-primary">TECHNICAL REQUIREMENTS.</span>
            </h3>

            {/* Description: Slate-400 (Grey) agar tidak terlalu kontras */}
            <p className="text-slate-400 font-bold italic uppercase text-[10px] md:text-xs tracking-[0.2em] leading-relaxed max-w-2xl mx-auto">
              Maintaining the level of accuracy and reliability of inspections
              in accordance with international standards.
            </p>

            {/* Simple Technical Divider */}
            <div className="pt-8 flex justify-center items-center gap-4">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <div className="w-12 h-px bg-white/10" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
