// app/contact/page.tsx
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pb-24 selection:bg-primary selection:text-white">
      {/* --- HEADER SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Technical Support Center
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              GET IN <br /> <span className="text-primary">TOUCH.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl font-medium italic leading-relaxed">
              Punya pertanyaan mengenai pelatihan atau kebutuhan inspeksi
              proyek? Tim ahli kami di Batam siap membantu Anda.
            </p>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            {/* LEFT: CONTACT FORM */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 uppercase italic tracking-tight">
                  Contact Form
                </h2>
                <div className="h-1 w-20 bg-primary" />
                <p className="text-slate-500 font-medium italic text-sm">
                  Isi formulir di bawah ini, tim kami akan segera menghubungi
                  Anda.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Fullname *
                    </label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold italic"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Email *
                    </label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold italic"
                      type="email"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Subject *
                    </label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold italic"
                      placeholder="Contoh: Info Pelatihan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Phone Number *
                    </label>
                    <Input
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold italic"
                      placeholder="0812..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Your Message *
                  </label>
                  <Textarea
                    className="min-h-[150px] rounded-[2rem] border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold italic p-6"
                    placeholder="Tuliskan detail pertanyaan Anda di sini..."
                  />
                </div>

                <Button className="h-16 px-12 rounded-full bg-slate-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] transition-all group">
                  Send Message{" "}
                  <Send
                    size={16}
                    className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </Button>
              </form>
            </div>

            {/* RIGHT: CONTACT INFO */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 uppercase italic tracking-tight">
                  How to Reach Us
                </h2>
                <div className="h-1 w-20 bg-primary" />
                <p className="text-slate-500 font-medium italic text-sm">
                  Kami berlokasi strategis di Batam, memudahkan akses bagi klien
                  lokal maupun internasional.
                </p>
              </div>

              <div className="space-y-8">
                {/* Info Cards */}
                <div className="group flex items-start gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-slate-950 hover:border-slate-950">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-colors">
                    <MapPin
                      className="text-primary group-hover:text-white"
                      size={24}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Office Location
                    </p>
                    <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-white uppercase italic leading-relaxed">
                      Ruko Mega Legenda 2 Blok E2 No 10, <br /> Batam Center,
                      Batam
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-slate-950 hover:border-slate-950">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-colors">
                    <Mail
                      className="text-primary group-hover:text-white"
                      size={24}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-white uppercase italic">
                      lapisbajainspektindo@gmail.com
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-slate-950 hover:border-slate-950">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-colors">
                    <Phone
                      className="text-primary group-hover:text-white"
                      size={24}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Hotline Services
                    </p>
                    <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-white uppercase italic">
                      (+62) 852-7211-7681
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:bg-slate-950 hover:border-slate-950">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-colors">
                    <Clock
                      className="text-primary group-hover:text-white"
                      size={24}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Working Hours
                    </p>
                    <p className="text-xs md:text-sm font-black text-slate-900 group-hover:text-white uppercase italic">
                      Senin - Sabtu | 08:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAP SECTION --- */}
      <section className="px-6">
        <div className="container mx-auto">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-[3rem] overflow-hidden border-[12px] border-slate-100 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0573678385624!2d104.0487!3d1.1213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98993881e186b%3A0x6b0485676839a89c!2sMega%20Legenda%202!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="grayscale-[0.5] contrast-[1.1] saturate-[0.8]"
            ></iframe>
          </div>
        </div>
      </section>

      {/* --- FLOATING WA BUTTON --- */}
      <a
        href="https://wa.me/6282284452366"
        target="_blank"
        className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with Specialist
        </span>
      </a>
    </main>
  );
}
