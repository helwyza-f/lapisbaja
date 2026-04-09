// components/public/home/ClientExperience.tsx
import Image from "next/image";

const projectHistory = [
  {
    name: "PT IEG Oilfield Indonesia",
    role: "Supply Man Power Inspection",
    location: "Batam",
    logo: "/images/clients/ieg.jpeg",
  },
  {
    name: "PT Baker Hughes",
    role: "Coating Inspection Service",
    location: "Batam",
    logo: "/images/clients/baker.png",
  },
  {
    name: "PT Cameron",
    role: "Third Party Inspection",
    location: "Batam",
    logo: "/images/clients/cameron.png",
  },
  {
    name: "PT Cladtek",
    role: "Technical Support & Inspection",
    location: "Batam / Luwuk",
    logo: "/images/clients/cladtek.png",
  },
];

export default function ClientExperience() {
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

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Text Content & Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Our Job History
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.9]">
                TRUSTED BY <br />
                <span className="text-primary">INDUSTRY LEADERS</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-md">
                Telah dipercaya oleh berbagai perusahaan multinasional dalam
                penyediaan tenaga ahli inspeksi dan pelatihan teknis
                bersertifikasi untuk proyek strategis.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-transform active:scale-95">
                <p className="text-3xl font-black text-slate-900">10+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Years Experience
                </p>
              </div>
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 transition-transform active:scale-95">
                <p className="text-3xl font-black text-primary italic">PRIME</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Quality Service
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Client Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectHistory.map((client) => (
                <div
                  key={client.name}
                  className="group p-6 bg-white border border-slate-100 rounded-3xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.98] lg:active:scale-100"
                >
                  <div className="flex items-center gap-5">
                    {/* Logo: Mobile berwarna, Desktop grayscale (hover to color) */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center p-3 transition-all duration-500 border border-slate-50 group-hover:border-primary/20 lg:grayscale lg:group-hover:grayscale-0">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={60}
                        height={60}
                        className="object-contain opacity-100 lg:opacity-50 lg:group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-sm uppercase italic tracking-tight group-hover:text-primary transition-colors">
                        {client.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {client.role}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        <span className="text-[9px] font-medium text-slate-400">
                          {client.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Experience Highlight (Tomori Project) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] p-8 relative overflow-hidden group border border-slate-800 transition-all duration-500 active:brightness-125 lg:active:brightness-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-primary" />
                  <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                    Highlight Experience
                  </p>
                </div>
                <h3 className="text-white text-2xl font-black uppercase italic leading-tight group-hover:text-primary/90 transition-colors">
                  Proyek Tomori - Luwuk <br />
                  <span className="text-slate-400 text-lg">
                    PT Cladtek Support
                  </span>
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xl italic">
                  Memberikan dukungan inspeksi teknis untuk Concrete Weight
                  Coating (CWC) dan 3LPP Coating Activity, memastikan setiap
                  aspek pengerjaan memenuhi standar internasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
