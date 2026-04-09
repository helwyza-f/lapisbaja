// app/gallery/page.tsx
import {
  ImageIcon,
  Maximize2,
  Drill,
  HardHat,
  ShieldCheck,
  Microscope,
  Factory,
  Scan,
} from "lucide-react";

const galleryPlaceholders = [
  {
    title: "Blasting & Painting Class",
    category: "Training",
    icon: <HardHat size={42} className="text-primary/30" />,
    id: "TR-001",
  },
  {
    title: "Dry Film Thickness Verification",
    category: "Inspection",
    icon: <Microscope size={42} className="text-primary/30" />,
    id: "IN-042",
  },
  {
    title: "Coating System Qualification",
    category: "Qualification",
    icon: <ShieldCheck size={42} className="text-primary/30" />,
    id: "QU-012",
  },
  {
    title: "Final Visual Inspection",
    category: "Quality Control",
    icon: <Maximize2 size={42} className="text-primary/30" />,
    id: "QC-088",
  },
  {
    title: "3LPP Pipe Rework Activity",
    category: "Rework",
    icon: <Drill size={42} className="text-primary/30" />,
    id: "RW-092",
  },
  {
    title: "CWC End Cutback Process",
    category: "Manpower",
    icon: <Factory size={42} className="text-primary/30" />,
    id: "MP-093",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-950 pb-24 selection:bg-primary selection:text-white">
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 text-left">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary" />
                <p className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">
                  Visual Archive
                </p>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                FIELD <br /> <span className="text-primary">DOCUMENTARY.</span>
              </h1>
            </div>
            <p className="text-slate-500 font-bold italic text-xs md:text-sm max-w-xs md:text-right border-l md:border-l-0 md:border-r border-primary/30 pl-6 md:pl-0 md:pr-6">
              Dokumentasi aktivitas teknis dan pelatihan industri sesuai standar
              internasional.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {galleryPlaceholders.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-[2.5rem] overflow-hidden bg-slate-900/50 border border-white/10 break-inside-avoid transition-all duration-700 hover:border-primary/40 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(245,101,35,0.2)]"
              >
                <div className="absolute inset-2 border border-white/[0.03] rounded-[2rem] pointer-events-none z-10" />
                <div className="relative aspect-square flex flex-col items-center justify-center p-12 transition-transform duration-700 group-hover:scale-[0.98]">
                  <div
                    className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fff 0.5px, transparent 0.5px), linear-gradient(90deg, #fff 0.5px, transparent 0.5px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="absolute top-10 left-10 text-white/10 group-hover:text-primary/40">
                    <Scan size={24} strokeWidth={1} />
                  </div>
                  <div className="relative z-10 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="absolute bottom-10 left-10 font-mono text-[9px] text-white/5 uppercase tracking-[0.3em]">
                    SEC_{item.id}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col justify-end">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-primary/60" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex flex-col md:flex-row items-center gap-6 px-10 py-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-ping opacity-20" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                  Operational Status:{" "}
                  <span className="text-white">
                    Active Standards Compliance
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
