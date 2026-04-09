// components/admin/TrainingsTable.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Edit3,
  Trash2,
  Calendar as CalendarIcon,
  AlertCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TrainingsTable() {
  const router = useRouter();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State - Sinkron dengan Meta dari Backend
  const [meta, setMeta] = useState({
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  });

  const fetchTrainings = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        let query = `/trainings?page=${page}&limit=${meta.limit}`;
        if (searchTerm) query += `&search=${searchTerm}`;

        const res = await api.get(query);
        const { items, meta: backendMeta } = res.data?.data || {};

        setTrainings(items || []);

        if (backendMeta) {
          setMeta(backendMeta);
        }
      } catch (err) {
        toast.error("SYSTEM_ERROR: Failure to synchronize training registry");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, meta.limit],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchTrainings(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchTrainings]);

  const handleDelete = async (id: string) => {
    if (!confirm("CRITICAL_ACTION: Terminate this program from registry?"))
      return;
    try {
      await api.delete(`/trainings/${id}`);
      toast.success("Industrial program successfully purged");
      fetchTrainings(meta.current_page);
    } catch (err) {
      toast.error("ACCESS_DENIED: Termination sequence failed");
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const { current_page, total_page } = meta;

    let startPage = Math.max(1, current_page - 2);
    let endPage = Math.min(total_page, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
      if (i < 1) continue;
      pages.push(
        <button
          key={i}
          onClick={() => fetchTrainings(i)}
          className={cn(
            "w-10 h-10 text-[11px] font-black transition-all border-b-2",
            current_page === i
              ? "border-slate-900 text-slate-900 bg-slate-50"
              : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200",
          )}
        >
          {i.toString().padStart(2, "0")}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* --- INDUSTRIAL FILTER BAR --- */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors"
            size={18}
          />
          <Input
            placeholder="FILTER BY PROGRAM TITLE / REGISTRY ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-12 rounded-lg border-slate-100 bg-slate-50 font-bold italic text-xs uppercase focus-visible:ring-1 focus-visible:ring-slate-950 transition-all"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => fetchTrainings(1)}
          className="h-12 w-12 rounded-lg border-slate-200 hover:bg-slate-50 transition-all"
        >
          <RefreshCw size={18} className={cn(loading && "animate-spin")} />
        </Button>
      </div>

      {/* --- COMPACT PROFESSIONAL TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                  # REF_ID
                </th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Program Title
                </th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-center">
                  Deployment
                </th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Price
                </th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-6 px-8">
                        <div className="h-3 bg-slate-100 rounded-full w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : trainings.length > 0 ? (
                trainings.map((t: any) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    <td className="py-6 px-8 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {t.id.split("-")[0]}
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-[14px] font-black text-slate-950 uppercase italic tracking-tight leading-tight block">
                        {t.title}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span className="text-[11px] font-black text-slate-800 uppercase">
                          {t.date_start
                            ? format(new Date(t.date_start), "dd MMM yyyy")
                            : "TBA"}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                          Standard Sch.
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-[12px] font-black text-slate-700 italic">
                        IDR {t.price?.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        {/* VIEW APPLICANTS BUTTON */}
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/trainings/${t.id}/applicants`,
                            )
                          }
                          variant="outline"
                          className="h-10 px-4 text-[9px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-950 hover:text-white transition-all gap-2"
                        >
                          <Users size={14} /> Applicants
                        </Button>

                        {/* VIEW DETAIL / SPECS BUTTON */}
                        <Button
                          onClick={() =>
                            router.push(`/dashboard/trainings/${t.id}`)
                          }
                          variant="outline"
                          className="h-10 w-10 p-0 border-slate-200 hover:bg-slate-950 hover:text-white"
                        >
                          <Eye size={15} />
                        </Button>

                        {/* DELETE BUTTON */}
                        <Button
                          onClick={() => handleDelete(t.id)}
                          variant="outline"
                          className="h-10 w-10 p-0 border-slate-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 grayscale opacity-20">
                      <AlertCircle size={56} strokeWidth={1} />
                      <p className="text-[12px] font-black uppercase tracking-[0.5em]">
                        NO TRAINING DATA SYNCED
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- REFINED INDUSTRIAL PAGINATION --- */}
      {!loading && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none">
              PAGE{" "}
              <span className="text-primary underline decoration-2 underline-offset-4">
                {meta.current_page}
              </span>{" "}
              OF {meta.total_page}
            </p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
              Total {meta.total_data.toLocaleString()} Registry Records
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              disabled={meta.current_page === 1}
              onClick={() => fetchTrainings(meta.current_page - 1)}
              className="text-slate-300 hover:text-slate-950 disabled:opacity-20 transition-all p-2 hover:scale-125 active:scale-90"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <div className="flex gap-6">{renderPageNumbers()}</div>
            <button
              disabled={meta.current_page === meta.total_page}
              onClick={() => fetchTrainings(meta.current_page + 1)}
              className="text-slate-300 hover:text-slate-950 disabled:opacity-20 transition-all p-2 hover:scale-125 active:scale-90"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
