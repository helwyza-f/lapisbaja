// app/trainings/[id]/register/page.tsx
import { api } from "@/lib/api";
import RegistrationForm from "@/components/public/trainings/RegistrationForm";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Daftar Pelatihan | PT Lapis Baja Inspektindo` };
}

export default async function RegisterPage({ params }: Props) {
  const { id } = await params;
  let training = null;

  try {
    const res = await api.get(`/trainings/${id}`);
    training = res.data?.data;
  } catch (error) {
    console.error("Fetch Detail Error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col lg:items-center lg:justify-center py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background Decor & Glow */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6 md:space-y-8">
        {/* Navigation */}
        <Link
          href={`/trainings/${id}`}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Detail
        </Link>

        {/* Heading Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <Info size={12} className="text-primary" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
              Step 1: Student Data
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
            JOIN THE <span className="text-primary">PROGRAM.</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium italic leading-relaxed">
            Mendaftar untuk:{" "}
            <span className="text-white font-bold underline decoration-primary underline-offset-4 uppercase">
              {training?.title || "Program Pelatihan"}
            </span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
          <RegistrationForm trainingId={id} />
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Official Certification Program by
          </p>
          <p className="text-[10px] text-white font-black uppercase italic tracking-widest">
            PT Lapis Baja Inspektindo
          </p>
        </div>
      </div>
    </main>
  );
}
