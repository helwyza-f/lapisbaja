// components/public/home/RecentTrainings.tsx
import { api } from "@/lib/api";
import { Training } from "@/lib/types";
import TrainingCard from "../trainings/TrainingCard";

export default async function RecentTrainings() {
  try {
    const res = await api.get("/trainings?limit=5");
    const trainings = res.data?.data || [];

    if (!Array.isArray(trainings) || trainings.length === 0) {
      return (
        <div className="text-center py-20 rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic text-sm">
            Belum ada jadwal pelatihan tersedia
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {trainings.map((training: Training, i: number) => (
          <div
            key={training.id}
            className={i >= 3 ? "hidden lg:block" : "block"}
          >
            {/* Prop disesuaikan menjadi 'data' agar sinkron dengan TrainingCard */}
            <TrainingCard data={training} />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-10 bg-orange-50 rounded-2xl border border-orange-100">
        <p className="text-primary font-black uppercase tracking-widest text-[10px]">
          Gagal memuat data pelatihan terbaru
        </p>
      </div>
    );
  }
}
