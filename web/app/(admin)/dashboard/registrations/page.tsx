// app/(admin)/dashboard/registrations/page.tsx
import RegistrationsTable from "@/components/admin/RegistrationsTable";
import { ListFilter } from "lucide-react";
import { Suspense } from "react"; // Tambahkan ini

// Pastikan halaman ini selalu dinamis
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function RegistrationsPage({ searchParams }: PageProps) {
  const initialFilters = {
    training_id:
      typeof searchParams.training_id === "string"
        ? searchParams.training_id
        : undefined,
    status:
      typeof searchParams.status === "string" ? searchParams.status : "ALL",
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-8 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
            <ListFilter size={16} /> Industrial Registry Database
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            REGISTRATION <span className="text-slate-300">CONTROL.</span>
          </h1>
        </div>

        <div className="hidden lg:block text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            System Node: Batam_Sector_01
          </p>
          <p className="text-xs font-black text-emerald-500 uppercase italic">
            Connection Secured & Encrypted
          </p>
        </div>
      </div>

      {/* WAJIB: Bungkus Client Component yang pakai useSearchParams dengan Suspense */}
      <Suspense
        fallback={
          <div className="w-full h-96 bg-white border border-slate-100 rounded-xl animate-pulse flex items-center justify-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Synchronizing Node...
            </p>
          </div>
        }
      >
        <RegistrationsTable initialFilters={initialFilters} />
      </Suspense>
    </div>
  );
}
