// app/trainings/page.tsx
import { Suspense } from "react";
import TrainingHeroBackground from "@/components/public/trainings/TrainingHeroBackground";
import TrainingListWrapper from "@/components/public/trainings/TrainingListWrapper";
import ListSkeleton from "@/components/public/trainings/ListSkeleton";

// Definisikan tipe untuk Next.js 15
type tParams = Promise<{ page?: string; limit?: string }>;

export default async function TrainingsPage(props: { searchParams: tParams }) {
  // UNWRAP searchParams menggunakan await (Wajib di Next.js 15+)
  const searchParams = await props.searchParams;
  const page = searchParams.page || "1";
  const limit = searchParams.limit || "9";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER: Langsung Render */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
        <TrainingHeroBackground />
        <div className="container mx-auto px-6 relative z-30 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/30 backdrop-blur-md">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Professional Certification
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              ALL TRAINING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                PROGRAMS.
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* LIST AREA: Loading Scoped */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-slate-100">
            <Suspense key={page} fallback={<ListSkeleton />}>
              <TrainingListWrapper page={page} limit={limit} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
