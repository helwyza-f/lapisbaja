// app/trainings/[id]/page.tsx
import { api } from "@/lib/api";
import Link from "next/link";
import { Metadata } from "next";
import TrainingDetail from "@/components/public/trainings/TrainingDetail";
import TrainingHeroBackground from "@/components/public/trainings/TrainingHeroBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await api.get(`/trainings/${id}`);
    const training = res.data?.data;
    return {
      title: `${training?.title} | Professional Training`,
      description: `Amankan slot Anda di ${training?.title}. Sertifikasi standar industri global.`,
    };
  } catch {
    return { title: "Training Detail" };
  }
}

export default async function TrainingDetailPage({ params }: Props) {
  const { id } = await params;
  let training = null;

  try {
    const res = await api.get(`/trainings/${id}`);
    training = res.data?.data;
  } catch (error) {
    console.error(error);
  }

  if (!training)
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic">
        404 | NOT FOUND
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
        <TrainingHeroBackground />

        <div className="container mx-auto px-6 relative z-30">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Standard Industry Certification
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] drop-shadow-2xl">
                {training.title.split(" ").map((word: string, i: number) => (
                  <span
                    key={i}
                    className={
                      i === 0
                        ? "text-primary block md:inline"
                        : "block md:inline"
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-slate-400 text-sm md:text-lg max-w-2xl italic font-medium leading-relaxed">
                Tingkatkan kompetensi teknis Anda melalui program pendaftaran
                pelatihan tersertifikasi dengan kurikulum standar internasional
                NACE & SSPC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="pb-20 -mt-8 md:-mt-16 relative z-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
              {/* LEFT: DETAIL CONTENT */}
              <div className="lg:col-span-8 p-6 md:p-16 border-b lg:border-b-0 lg:border-r border-slate-50">
                <TrainingDetail data={training} />
              </div>

              {/* RIGHT: SIDEBAR CTA */}
              <div className="lg:col-span-4 p-6 md:p-12 bg-slate-50/50">
                <div className="sticky top-28 space-y-8">
                  <div className="p-8 md:p-10 bg-slate-950 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden group shadow-2xl">
                    {/* Decorative Element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-colors" />

                    <div className="relative z-10 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                          <Zap size={14} fill="currentColor" />
                          Investment
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-black italic tracking-tighter">
                            Rp {training.price?.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 py-6 border-y border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/20 p-1 rounded-lg">
                            <Award size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase italic">
                              Sertifikat Resmi
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Diakui secara global di industri energi &
                              konstruksi.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/20 p-1 rounded-lg">
                            <ShieldCheck size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase italic">
                              Instruktur Ahli
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              Praktisi senior dengan pengalaman lapangan 10+
                              tahun.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Button
                          asChild
                          className="w-full h-16 bg-primary hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all duration-500 shadow-xl shadow-primary/20 group/btn"
                        >
                          <Link
                            href={`/trainings/${id}/register`}
                            className="flex items-center justify-center gap-2"
                          >
                            Secure My Slot
                            <ArrowRight
                              size={18}
                              className="group-hover/btn:translate-x-2 transition-transform"
                            />
                          </Link>
                        </Button>
                        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest italic animate-pulse">
                          Available: 5 Seats Left
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
