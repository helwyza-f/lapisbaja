// components/public/home/StatsSection.tsx

export default function StatsSection() {
  const stats = [
    {
      label: "Years Expertise",
      value: "20+",
      sub: "Senior Technical Advisor",
    },
    {
      label: "Specialized Projects",
      value: "50+",
      sub: "Major Technical Works",
    },
    {
      label: "Qualified Inspectors",
      value: "100%",
      sub: "NACE & CSWIP Certified",
    },
    {
      label: "Inspection Tools",
      value: "Supply",
      sub: "Certified Equipment",
    },
  ];

  return (
    <section className="bg-slate-950 py-16 md:py-24 border-y border-slate-900 relative overflow-hidden">
      {/* Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#F56523 0.5px, transparent 0.5px), linear-gradient(90deg, #F56523 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center lg:items-start text-center lg:text-left group animate-in fade-in zoom-in duration-700 fill-mode-forwards"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative mb-4">
                <p className="text-5xl md:text-6xl lg:text-7xl font-black text-primary italic tracking-tighter drop-shadow-[0_0_15px_rgba(245,101,35,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:text-orange-400">
                  {s.value}
                </p>
                {/* Accent line: Dibuat Rounded */}
                <div className="absolute -bottom-2 left-0 w-8 h-[3px] bg-primary group-hover:w-full transition-all duration-500 ease-in-out rounded-full" />
              </div>

              <div className="mt-2 space-y-2">
                <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em] leading-tight">
                  {s.label}
                </h4>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    {s.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
