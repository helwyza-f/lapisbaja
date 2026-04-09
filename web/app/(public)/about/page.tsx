// app/about/page.tsx
import { Shield, Target, Users, Award, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
      {/* --- HERO SECTION: MOBILE OPTIMIZED --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6 md:space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/30">
              NIB: 250122006826
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
              COMMITTED TO <br />{" "}
              <span className="text-primary block md:inline">COMPLY.</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-lg max-w-2xl font-medium italic leading-relaxed mx-auto md:mx-0">
              PT Lapis Baja Inspektindo berdedikasi untuk memenuhi setiap
              kebutuhan teknis proyek klien dengan akurasi dan keandalan tinggi
              sesuai standar internasional.
            </p>
          </div>
        </div>
      </section>

      {/* --- VISION & MISSION: SMART GRID --- */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text First on Mobile */}
            <div className="space-y-8 order-2 lg:order-1 text-center md:text-left">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                  OUR VISION <br className="hidden md:block" /> &{" "}
                  <span className="text-primary">MISSION.</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base font-medium italic leading-relaxed">
                  Menjadi penyedia personel inspeksi berkualitas dan
                  bersertifikat dalam bidang Coating, Welding, dan NDT, serta
                  menjadi konsultan teknis yang terpercaya.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    title: "Standardization",
                    desc: "Menjaga tingkat akurasi dan keandalan inspeksi sesuai standar internasional terkait dalam spesifikasi proyek.",
                  },
                  {
                    title: "Excellence",
                    desc: "Menyediakan Technical Advisor berpengalaman lebih dari 20 tahun di industri Oil & Gas.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 mx-auto md:mx-0">
                      <Target className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-950 uppercase italic text-sm text-center md:text-left">
                        {item.title}
                      </h4>
                      <p className="text-[11px] md:text-xs text-slate-500 font-bold mt-1 text-center md:text-left">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Second on Mobile */}
            <div className="relative h-[300px] md:h-[600px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white order-1 lg:order-2">
              <Image
                src="http://googleusercontent.com/image_collection/image_retrieval/4949446074785380522_1"
                alt="Industrial Site Batam"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION: RESPONSIVE CARDS --- */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 space-y-12 md:space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
              PERSONNEL{" "}
              <span className="text-primary block md:inline">
                QUALIFICATION.
              </span>
            </h2>
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest italic">
              Supported by Senior Certified Inspectors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Mujianto Ali",
                role: "Senior Coating Inspector",
                cert: "NACE CIP Level 3",
                exp: "20+ Years Experience",
              },
              {
                name: "Ryandika Syah Putra",
                role: "Coating Inspector",
                cert: "NACE CIP Level 2",
                exp: "10+ Years Experience",
              },
              {
                name: "Aga Medyka Palba",
                role: "NDT Inspector",
                cert: "CSWIP 3.2 & NACE CIP L2",
                exp: "10+ Years Experience",
              },
              {
                name: "Gentara Putra",
                role: "Coating Inspector",
                cert: "NACE CIP Level 2",
                exp: "Oil and Gas Experience",
              },
            ].map((person, i) => (
              <div
                key={i}
                className="group p-6 md:p-8 bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 hover:bg-slate-950 transition-all duration-500 text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-full mx-auto mb-6 overflow-hidden border-2 md:border-4 border-white shadow-lg group-hover:border-primary/50 transition-all">
                  <div className="w-full h-full bg-slate-400 flex items-center justify-center text-white">
                    <Users size={28} />
                  </div>
                </div>
                <h4 className="text-sm md:text-lg font-black text-slate-900 uppercase italic group-hover:text-white transition-colors">
                  {person.name}
                </h4>
                <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                  {person.role}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 group-hover:border-white/10">
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-tighter leading-tight">
                    {person.cert}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 group-hover:text-primary mt-1">
                    {person.exp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER INFO: COMPACT MOBILE --- */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-white grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="space-y-6 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                OUR HEAD <br /> <span className="text-primary">QUARTERS.</span>
              </h2>
              <div className="space-y-4 max-w-xs mx-auto md:mx-0">
                <div className="flex gap-4 items-start text-left">
                  <MapPin className="text-primary shrink-0" size={20} />
                  <p className="text-[11px] md:text-sm font-bold text-slate-400 italic">
                    Ruko Mega Legenda 2 Blok E2 No 10, Batam Center
                  </p>
                </div>
                <div className="flex gap-4 items-center text-left">
                  <Briefcase className="text-primary shrink-0" size={20} />
                  <p className="text-[11px] md:text-sm font-bold text-slate-400 italic">
                    NIB: 250122006826
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] space-y-6 relative z-10 text-center md:text-left">
              <h4 className="text-lg md:text-xl font-black uppercase italic text-primary">
                Contact us
              </h4>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">
                  Email Address
                </p>
                <p className="text-sm md:text-lg font-black italic break-all md:break-normal">
                  lapisbajainspektindo@gmail.com
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">
                  Hotline Services
                </p>
                <p className="text-sm md:text-lg font-black italic">
                  0852-7211-7681 (Riko)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
