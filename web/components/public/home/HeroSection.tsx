// components/public/home/HeroSection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      <HeroBackground />

      <div className="container mx-auto px-6 lg:px-12 relative z-20">
        <div className="max-w-4xl space-y-8 md:space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black text-white/80 tracking-[0.3em] uppercase">
              PT Lapis Baja Inspektindo
            </span>
          </div>

          {/* Headline Utama */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
              COMMITTED TO <br />
              <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                COMPLY.
              </span>
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] italic">
              Technical Project Requirements
            </p>
          </div>

          {/* Dynamic Content (Subtitle & Mitra Strategis Static) */}
          <HeroContent />
          <div className="relative pl-6 md:pl-8 border-l border-white/10">
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] leading-relaxed italic max-w-xl">
              Mitra strategis industri di Batam untuk inspeksi teknis dan
              pelatihan profesional.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-orange-600 text-white h-16 px-10 font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105"
              asChild
            >
              <Link href="/trainings">Cek Jadwal Pelatihan</Link>
            </Button>

            {/* Tombol Profil Perusahaan: Fixed border-white & text-white visibility */}
            <Button
              variant="outline"
              size="lg"
              className="bg-white/5 border-2 border-white/40 text-white hover:bg-white hover:text-slate-950 h-16 px-10 font-black uppercase tracking-widest rounded-full backdrop-blur-md transition-all duration-300 shadow-xl"
              asChild
            >
              <Link href="/about">Profil Perusahaan</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Technical Metadata (DITAMPILKAN LAGI) */}
      <div className="absolute bottom-12 right-12 z-20 hidden xl:block animate-in fade-in slide-in-from-right duration-1000">
        <div className="flex items-center gap-8 bg-slate-950/40 backdrop-blur-md p-6 border-r-4 border-primary rounded-l-3xl border-y border-white/5">
          <div className="text-right space-y-1">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">
              Office Location
            </p>
            <p className="text-[11px] text-white/70 font-bold italic tracking-tight uppercase">
              Mega Legenda 2, Batam
            </p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right space-y-1">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">
              Industry Standard
            </p>
            <p className="text-[11px] text-white/70 font-bold italic tracking-tight uppercase">
              ISO | NACE | CSWIP
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
