// app/trainings/page.tsx
import { api } from "@/lib/api";
import TrainingList from "@/components/public/trainings/TrainingList";
import TrainingHeroBackground from "@/components/public/trainings/TrainingHeroBackground";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = searchParams.page || "1";
  const limit = searchParams.limit || "9"; // Grid 3x3 yang ideal
  let trainings = [];

  try {
    // Tarik data berdasarkan page dan limit dari URL
    const res = await api.get(`/trainings?page=${page}&limit=${limit}`);
    trainings = res.data?.data || [];
  } catch (error) {
    console.error("Gagal ambil data pelatihan:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
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

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-slate-100">
            {/* Lempar data dan info page saat ini */}
            <TrainingList
              initialData={trainings}
              currentPage={parseInt(page)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
