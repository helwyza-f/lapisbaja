// components/public/home/ContactCTA.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, MapPin, Clock } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* 1. Dark Overlay Tipis: Agar warna orange tidak terlalu menusuk mata */}
      <div className="absolute inset-0 bg-slate-900/10 z-0" />

      {/* 2. Gradient Shade: Memberikan kedalaman visual (depth) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 z-0" />

      {/* 3. Pattern Background halus */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#000 0.8px, transparent 0.8px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content Area */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
              Official Technical Center
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[1.1] drop-shadow-xl">
              TINGKATKAN <br className="hidden md:block" />
              <span className="text-slate-900">KUALIFIKASI TEKNIS</span>{" "}
              <br className="hidden md:block" />
              ANDA SEKARANG
            </h2>

            <p className="text-white/90 max-w-xl mx-auto lg:mx-0 font-bold text-sm md:text-base leading-relaxed">
              Konsultasikan kebutuhan sertifikasi personil Anda dengan tim ahli
              PT Lapis Baja Inspektindo. Kami siap membantu Anda mencapai
              standar kompetensi internasional.
            </p>

            {/* Info Box: Dibuat Rounded-2xl & Clean */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-black/10 border border-white/20 rounded-2xl transition-transform hover:-translate-y-1 duration-300">
                <MapPin className="text-primary shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Office Location
                  </p>
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    Mega Legenda 2, Batam
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-black/10 border border-white/20 rounded-2xl transition-transform hover:-translate-y-1 duration-300">
                <Clock className="text-primary shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Working Hours
                  </p>
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    Mon - Sat | 08:00 - 17:00
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                className="bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-xs h-16 px-10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95"
                asChild
              >
                <Link
                  href="https://wa.me/6285272117681"
                  className="flex items-center gap-3"
                >
                  <MessageCircle size={18} />
                  Hubungi Via WhatsApp
                </Link>
              </Button>
            </div>
          </div>

          {/* Map Area: Dibuat Rounded-2xl total */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden border-[12px] border-white/20 rounded-[2.5rem] backdrop-blur-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.05436214358!2d104.0531!3d1.1301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMDcnNDguNCJOIDEwNMKwMDMnMTEuMiJF!5e0!3m2!1sen!2sid!4v1647412345678!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover contrast-110 saturate-100"
            ></iframe>
            {/* Subtle Overlay Frame internal */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}
