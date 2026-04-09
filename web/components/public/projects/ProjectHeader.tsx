// components/public/projects/ProjectHeader.tsx
"use client";

export default function ProjectHeader() {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-slate-950 overflow-hidden">
      {/* Background: Pola Grid Halus - Tetap Industrial tapi Minimalis */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-6 max-w-4xl">
          {/* Label Kecil */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-primary/60" />
            <p className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">
              Portfolio History
            </p>
          </div>

          {/* Title: Solid & Italic tanpa Gradient alay */}
          <div className="space-y-0">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
              INDUSTRIAL <br />
              <span className="text-primary">PROJECTS.</span>
            </h1>
          </div>

          {/* Deskripsi: Bersih dengan Border-left Tipis */}
          <div className="max-w-xl mt-4">
            <p className="text-slate-500 font-bold italic text-xs md:text-sm leading-relaxed border-l border-primary/40 pl-5">
              Konsisten dalam memenuhi spesifikasi teknis proyek melalui standar
              inspeksi internasional.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Dekoratif: Kode Koordinat / ID Proyek (Opsional - Memberi kesan Teknis) */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] rotate-90 origin-right">
          LAT 1.1213° N / LONG 104.0487° E
        </p>
      </div>
    </section>
  );
}
