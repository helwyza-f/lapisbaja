// app/trainings/status/page.tsx
import { Metadata } from "next";
import StatusContent from "./StatusContent";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cek Status Pendaftaran | PT Lapis Baja Inspektindo",
  description:
    "Pantau status pendaftaran dan verifikasi pembayaran pelatihan sertifikasi teknis Anda secara real-time.",
};

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-primary animate-spin" size={40} />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">
              Initializing System...
            </p>
          </div>
        }
      >
        <StatusContent />
      </Suspense>
    </main>
  );
}
