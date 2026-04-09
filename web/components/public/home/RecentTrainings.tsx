// components/public/home/RecentTrainings.tsx
import { api } from "@/lib/api";
import { Training } from "@/lib/types";
import TrainingCard from "../trainings/TrainingCard";

export default async function RecentTrainings() {
  try {
    // Meminta limit 5 untuk tampilan grid di home
    const res = await api.get("/trainings?limit=5");

    /**
     * SYNC WITH NEW BACKEND:
     * Backend sekarang mengirim data dalam bentuk:
     * { status: "success", data: { items: [...], meta: {...} } }
     */
    const trainings = res.data?.data?.items || [];

    if (!Array.isArray(trainings) || trainings.length === 0) {
      return (
        <div className="text-center py-24 rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/30">
          <div className="space-y-2">
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic text-sm">
              SCHEDULES_NOT_FOUND
            </p>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
              Belum ada jadwal pelatihan yang dipublikasikan.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {trainings.map((training: Training, i: number) => (
          <div
            key={training.id}
            // Responsive logic: Mobile liat 1-2, Tablet 3, Desktop 5
            className={cn(
              "transition-all duration-500",
              i >= 2 ? "hidden sm:block lg:block" : "block", // Mobile hide after 2
              i >= 3 ? "hidden lg:block" : "block", // Tablet hide after 3
            )}
          >
            <TrainingCard data={training} />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("HOME_FETCH_ERR:", error);
    return (
      <div className="text-center py-12 bg-orange-50/50 rounded-[2rem] border border-orange-100/50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
          <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            Node synchronization failure. Please refresh.
          </p>
        </div>
      </div>
    );
  }
}

// Helper function (Pastikan kamu punya cn util atau import dari lib/utils)
import { cn } from "@/lib/utils";
