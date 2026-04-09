// app/services/page.tsx
import {
  CheckCircle2,
  HardHat,
  Users,
  Settings,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Technical Training & Examination",
    desc: "Program pelatihan intensif untuk Blasting & Painting Inspection Class. Mencakup teori spesifikasi ITP, TDS, dan praktik lapangan menggunakan standar internasional.",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/8744092625250375710_0",
    icon: <HardHat className="text-primary" />,
    features: [
      "Surface Preparation Standards",
      "Paint Technical Data Sheet (TDS)",
      "Adhesion & Holiday Test Practical",
      "Environment Condition Inspection",
    ],
    tag: "Certification",
  },
  {
    title: "Inspection Personnel Supply",
    desc: "Penyediaan tenaga ahli bersertifikat internasional (NACE CIP L3, CSWIP, NDT) untuk Offshore dan Onshore facility dengan pengalaman lebih dari 20 tahun.",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/4949446074785380522_0",
    icon: <Users className="text-primary" />,
    features: [
      "Senior Coating Inspector (NACE L3)",
      "Certified Welding Inspector (CSWIP)",
      "NDT Technical Advisors",
      "Third Party Inspection Services",
    ],
    tag: "Manpower",
  },
  {
    title: "Qualification & Witnessing",
    desc: "Layanan verifikasi dan saksi ahli untuk kualifikasi sistem coating, kualifikasi welder, serta sertifikasi kompetensi personel Blaster & Painter.",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/8744092625250375710_1",
    icon: <ShieldCheck className="text-primary" />,
    features: [
      "Blaster & Painter Qualification",
      "Welding Qualification Witness",
      "Coating System Qualification",
      "Personnel Competency Audit",
    ],
    tag: "Quality Control",
  },
  {
    title: "Inspection Tools & Equipment",
    desc: "Penyediaan dan penyewaan alat inspeksi teknis presisi seperti Elcometer dan PosiTest untuk pengukuran DFT, profil permukaan, dan deteksi holiday.",
    image:
      "http://googleusercontent.com/image_collection/image_retrieval/2714408984562028796_0",
    icon: <Settings className="text-primary" />,
    features: [
      "DFT Gauges (Elcometer/PosiTector)",
      "Surface Profile Measurement",
      "High Voltage Holiday Detector",
      "Pull-off Adhesion Tester",
    ],
    tag: "Equipment Supply",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em]">
              Official Services & Capabilities
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-8">
            INDUSTRIAL <br /> <span className="text-primary">SOLUTIONS.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium italic leading-relaxed">
            Mitra strategis dalam memastikan kualitas teknis proyek industri
            melalui inspeksi presisi, suplai tenaga ahli, dan pelatihan
            bersertifikasi.
          </p>
        </div>
      </section>

      {/* --- SERVICES LIST --- */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 space-y-24 md:space-y-40">
          {services.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-slate-100 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative h-[350px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                      {s.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                    {s.tag}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                    {s.title}
                  </h2>
                  <p className="text-slate-500 text-base md:text-lg font-medium italic leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {s.features.map((f, fi) => (
                    <div
                      key={fi}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-primary shrink-0"
                      />
                      <span className="text-[11px] font-black text-slate-700 uppercase italic tracking-tight">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Button
                    asChild
                    className="h-16 px-10 rounded-full bg-slate-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] transition-all group"
                  >
                    <Link href="/contact" className="flex items-center gap-3">
                      Inquiry This Service{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTACT CTA SECTION --- */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10 z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 z-0" />
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
                Technical Consultation
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[1.1] drop-shadow-xl">
                KONSULTASIKAN <br className="hidden md:block" />
                <span className="text-slate-900">PROYEK TEKNIS</span>{" "}
                <br className="hidden md:block" />
                ANDA SEKARANG
              </h2>

              <p className="text-white/90 max-w-xl mx-auto lg:mx-0 font-bold text-sm md:text-base leading-relaxed italic">
                Pastikan kepatuhan proyek Anda terhadap standar internasional
                dengan bimbingan Technical Advisor ahli PT Lapis Baja
                Inspektindo. [cite: 2, 17, 22]
              </p>

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
                    Inquiry via WhatsApp
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map Area */}
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
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-[2rem]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
