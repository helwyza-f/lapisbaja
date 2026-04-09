// components/public/home/LearningActivities.tsx
import Image from "next/image";
import {
  Gauge,
  Microscope,
  FileText,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const activities = [
  {
    title: "Surface Preparation",
    desc: "Praktik pengecekan profil permukaan baja, kebersihan SA 2.5, hingga pengujian kontaminasi garam (Bresle Test).",
    icon: <Microscope className="w-6 h-6" />,
    image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
    tag: "Blasting & Surface",
  },
  {
    title: "Coating Instruments",
    desc: "Penguasaan alat Elcometer & PosiTest untuk presisi pengukuran Dry Film Thickness (DFT) sesuai spesifikasi.",
    icon: <Gauge className="w-6 h-6" />,
    image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg",
    tag: "Instruments",
  },
  {
    title: "Quality Documentation",
    desc: "Simulasi pembuatan Daily Report, pembacaan TDS/MSDS, dan verifikasi ITP untuk standar Quality Control.",
    icon: <FileText className="w-6 h-6" />,
    image: "https://images.pexels.com/photos/3862371/pexels-photo-3862371.jpeg",
    tag: "Reporting",
  },
  {
    title: "Adhesion & Holiday Test",
    desc: "Pengujian integritas lapisan cat melalui metode Cross-cut, Pull-off, serta deteksi pinhole dengan alat tegangan tinggi.",
    icon: <ShieldCheck className="w-6 h-6" />,
    image: "https://images.pexels.com/photos/8961313/pexels-photo-8961313.jpeg",
    tag: "Integrity Test",
  },
];

export default function LearningActivities() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full shadow-xl">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Technical Training Curriculum
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            KEY LEARNING <br />
            <span className="text-primary">ACTIVITIES.</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl mx-auto italic">
            Kurikulum kami dirancang untuk menjembatani teori kelas dengan
            kebutuhan nyata di lapangan industri Oil & Gas.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((act, i) => (
            <div
              key={i}
              className="group relative h-[420px] rounded-[3rem] overflow-hidden bg-slate-900 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(245,101,35,0.25)] border border-slate-100/10"
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={act.image}
                  alt={act.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={i === 0}
                  className="object-cover object-center lg:grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
              </div>

              {/* Top Layout */}
              <div className="relative z-20 p-8 flex justify-between items-start">
                <div className="px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {act.tag}
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  {act.icon}
                </div>
              </div>

              {/* Bottom Content Layer */}
              <div className="absolute bottom-0 left-0 w-full p-10 z-20 space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                  <span className="w-4 h-[1px] bg-primary" />
                  Technical Module 0{i + 1}
                </div>
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tight leading-tight transition-colors">
                  {act.title}
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed font-medium group-hover:text-white transition-colors">
                  {act.desc}
                </p>

                {/* Simple Action Indicator */}
                <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span>Explore Module</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Industry Standards */}
        <div className="mt-20 flex flex-wrap justify-center gap-4 md:gap-8">
          {["NACE", "SSPC", "ISO", "ASTM", "AMPP"].map((std) => (
            <div
              key={std}
              className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-black text-[10px] tracking-[0.3em] hover:text-primary transition-all cursor-default"
            >
              {std}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
