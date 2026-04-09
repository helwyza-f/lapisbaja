// components/public/layout/Footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 md:py-20 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Company Info - Tetap Tegas di Mobile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">
                PT Lapis Baja<span className="text-primary text-2xl">.</span>
                <span className="text-primary">Inspektindo</span>
              </h3>
              <div className="h-1 w-12 bg-primary rounded-full" />
            </div>
            <p className="text-xs md:text-sm leading-relaxed max-w-md font-medium text-slate-400 italic">
              "Supply, Qualify, and Certify Inspection Personnel in Coating,
              Welding and NDT." Berkomitmen penuh pada persyaratan teknis proyek
              sesuai standar internasional.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                NIB: 250122006826
              </span>
            </div>
          </div>

          {/* Quick Links - Left Aligned di Mobile */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] border-l-2 border-primary pl-3">
              Navigation
            </h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              {["Trainings", "Services", "Gallery", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-primary transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Stacked & Left Aligned */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] border-l-2 border-primary pl-3">
              Contact Center
            </h4>
            <ul className="space-y-5 text-[11px] md:text-xs font-medium">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="leading-relaxed group-hover:text-white transition-colors">
                  Ruko Mega Legenda 2 Blok E2 No 10, Batam Center, Batam
                </span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Phone size={14} className="text-primary" />
                </div>
                <span className="group-hover:text-white transition-colors">
                  0852-7211-7681 (Riko)
                </span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Mail size={14} className="text-primary" />
                </div>
                <span className="break-all group-hover:text-white transition-colors">
                  lapisbajainspektindo@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Tetap Professional */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-600 order-2 md:order-1">
            © {currentYear} PT Lapis Baja Inspektindo.{" "}
            <br className="md:hidden" /> Built for Excellence.
          </p>
          <div className="flex gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 order-1 md:order-2">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Privacy <ExternalLink size={10} />
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Terms <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
