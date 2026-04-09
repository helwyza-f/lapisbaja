// components/public/home/ServiceSection.tsx
import Image from "next/image";
import { Paintbrush, SearchCheck, UserCheck, Briefcase } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Training & Examination",
    desc: "Blasting and Painting Inspection Class mencakup penguasaan standar industri, TDS, dan praktik alat inspeksi dasar.",
    icon: <Paintbrush className="w-8 h-8" />,
    image: "https://images.pexels.com/photos/5621946/pexels-photo-5621946.jpeg",
  },
  {
    number: "02",
    title: "Supply Inspector",
    desc: "Penyediaan Coating, Welding, dan NDT Inspector bersertifikat internasional untuk memastikan akurasi inspeksi.",
    icon: <SearchCheck className="w-8 h-8" />,
    image: "https://images.pexels.com/photos/8961313/pexels-photo-8961313.jpeg",
  },
  {
    number: "03",
    title: "Technical Advisor",
    desc: "Layanan konsultansi ahli untuk Witness Welding Qualification dan Coating System Qualification sesuai spesifikasi proyek.",
    icon: <Briefcase className="w-8 h-8" />,
    image: "https://images.pexels.com/photos/3862371/pexels-photo-3862371.jpeg",
  },
  {
    number: "04",
    title: "Personnel Qualification",
    desc: "Uji kualifikasi teknis mandiri untuk tenaga kerja Blaster dan Painter guna memastikan kompetensi standar lapangan.",
    icon: <UserCheck className="w-8 h-8" />,
    image:
      "https://images.pexels.com/photos/10123188/pexels-photo-10123188.jpeg",
  },
];

export default function ServiceSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section - Animasi Fade In Up via Tailwind */}
        <div className="max-w-3xl mb-16 md:mb-20 space-y-4 text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-10 h-[2px] bg-primary" />
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.5em]">
              Our Expertise
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Solusi Inspeksi Terpadu <br /> Untuk{" "}
            <span className="text-slate-300">Kualitas Proyek.</span>
          </h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative h-[400px] md:h-[500px] border border-slate-100 bg-slate-900 transition-all duration-500 overflow-hidden flex flex-col justify-end p-8 animate-in fade-in slide-in-from-bottom-12 fill-mode-forwards"
              style={{ animationDelay: `${i * 150}ms` }} // Stagger delay tanpa JS
            >
              {/* Image Layer dengan Optimasi Prop Sizes */}
              <div className="absolute inset-0 z-0 opacity-40 lg:opacity-20 lg:group-hover:opacity-100 transition-all duration-700">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover grayscale lg:group-hover:grayscale-0 scale-110 lg:group-hover:scale-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
              </div>

              {/* Ghost Numbering */}
              <span className="absolute -right-2 -top-4 text-8xl font-black text-white opacity-5 italic z-10">
                {s.number}
              </span>

              {/* Content Layer */}
              <div className="relative z-20 space-y-4">
                {/* Icon Box dengan Hover Skew Animation via Tailwind */}
                <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-none mb-6 shadow-lg transform -skew-x-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="skew-x-12">{s.icon}</div>
                </div>

                <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors duration-300">
                  {s.title}
                </h4>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                  {s.desc}
                </p>

                {/* Mobile: Tampil | Desktop: Muncul saat hover */}
                <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500">
                  <span>View Details</span>
                  <div className="w-8 h-[1px] bg-primary" />
                </div>
              </div>

              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-0 h-[4px] bg-primary lg:group-hover:w-full transition-all duration-500 z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
