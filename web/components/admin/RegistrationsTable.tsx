// components/admin/RegistrationsTable.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import StatusBadge from "./StatusBadge";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
  Calendar as CalendarIcon,
  RefreshCw,
  ArrowUpRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegistrationsTable({
  initialFilters,
}: {
  initialFilters?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state dengan initial filters dari RSC
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    initialFilters?.status || "ALL",
  );
  const [trainingId, setTrainingId] = useState(
    initialFilters?.training_id || "",
  );
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [meta, setMeta] = useState({
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  });

  const fetchRegistrations = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        let query = `/registrations?page=${page}&limit=10`;

        if (searchTerm) query += `&search=${searchTerm}`;
        if (statusFilter !== "ALL") query += `&status=${statusFilter}`;
        if (trainingId) query += `&training_id=${trainingId}`; // Pass training filter
        if (date) query += `&date=${format(date, "yyyy-MM-dd")}`;

        const res = await api.get(query);
        const { items, meta: paginationMeta } = res.data?.data || {};

        setRegistrations(items || []);
        setMeta(
          paginationMeta || {
            current_page: 1,
            total_page: 1,
            total_data: 0,
            limit: 10,
          },
        );
      } catch (err: any) {
        toast.error("DATA_ERR: Node synchronization failed.");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter, date, trainingId],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchRegistrations(1), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, date, trainingId, fetchRegistrations]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setTrainingId("");
    setDate(undefined);
    router.push("/dashboard/registrations"); // Clean URL
  };

  const renderPageNumbers = () => {
    const pages = [];
    const { current_page, total_page } = meta;
    let startPage = Math.max(1, current_page - 2);
    let endPage = Math.min(total_page, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => fetchRegistrations(i)}
          className={cn(
            "w-10 h-10 text-[12px] font-black transition-all border-b-2 tracking-tighter",
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
    <div className="bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden rounded-xl">
      {/* FILTER BAR */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-wrap lg:flex-nowrap gap-5 items-center">
        {/* Active Training Indicator (New!) */}
        {trainingId && (
          <div className="flex items-center gap-3 px-4 h-12 bg-primary/10 border border-primary/20 rounded-lg animate-in slide-in-from-left-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
              Filtering Program Mode
            </p>
            <button
              onClick={() => setTrainingId("")}
              className="text-primary hover:scale-110 transition-transform"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="relative flex-1 min-w-[320px] group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
            size={18}
          />
          <Input
            placeholder="SEARCH PARTICIPANT / REG_ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pl-12 rounded-lg border-slate-200 bg-white text-[13px] font-bold tracking-tight focus-visible:ring-1 focus-visible:ring-slate-950 transition-all placeholder:text-slate-300 uppercase"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-[200px] h-12 rounded-lg border-slate-200 bg-white text-[11px] font-black uppercase tracking-widest focus:ring-1 focus:ring-slate-950">
            <SelectValue placeholder="STATUS" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white shadow-2xl">
            <SelectItem
              value="ALL"
              className="text-[11px] font-black uppercase py-3"
            >
              ALL STATUS
            </SelectItem>
            <SelectItem
              value="PENDING"
              className="text-[11px] font-black uppercase py-3"
            >
              PENDING
            </SelectItem>
            <SelectItem
              value="APPROVED"
              className="text-[11px] font-black uppercase text-emerald-600 py-3"
            >
              APPROVED
            </SelectItem>
            <SelectItem
              value="REJECTED"
              className="text-[11px] font-black uppercase text-red-600 py-3"
            >
              REJECTED
            </SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full lg:w-[240px] h-12 rounded-lg border-slate-200 bg-white justify-start text-left font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all",
                !date && "text-slate-400",
              )}
            >
              <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
              {date ? format(date, "dd MMM yyyy") : <span>PICK DATE</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 rounded-2xl border-slate-200 bg-white shadow-2xl"
            align="end"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-4"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={resetFilters}
          className="h-12 w-12 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 bg-white transition-all active:scale-90"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION (Tetap Bold & Professional) */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                # REF_ID
              </th>
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                PARTICIPANT
              </th>
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                PROGRAM
              </th>
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-center">
                STATUS
              </th>
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                TIMESTAMP
              </th>
              <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 text-right">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-6 px-8">
                      <div className="h-3 bg-slate-100 rounded-full w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : registrations.length > 0 ? (
              registrations.map((reg: any) => (
                <tr
                  key={reg.id}
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  <td className="py-6 px-8 font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                    {reg.id.split("-")[0]}
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-[15px] font-black text-slate-900 uppercase italic tracking-tight">
                      {reg.name || "LBI USER"}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-[12px] font-bold text-slate-500 uppercase tracking-tight leading-tight block max-w-[200px]">
                      {reg.training_title}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-center">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-800 uppercase italic tracking-tighter">
                        {format(new Date(reg.created_at), "dd MMM yyyy")}
                      </span>
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                        {format(new Date(reg.created_at), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/registrations/${reg.id}`)
                      }
                      variant="outline"
                      className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.2em] border-slate-200 rounded-lg hover:bg-slate-950 hover:text-white transition-all gap-3 shadow-sm active:scale-95"
                    >
                      DETAILS <ArrowUpRight size={14} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 grayscale opacity-20">
                    <AlertCircle size={56} strokeWidth={1} />
                    <p className="text-[12px] font-black uppercase tracking-[0.5em]">
                      DATABASE EMPTY
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ENHANCED PAGINATION */}
      <div className="p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="space-y-2">
          <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none">
            PAGE{" "}
            <span className="text-primary underline decoration-2 underline-offset-4">
              {meta.current_page}
            </span>{" "}
            OF {meta.total_page}
          </p>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
            {meta.total_data.toLocaleString()} INDUSTRIAL ENTRIES SYNCED
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            disabled={meta.current_page === 1}
            onClick={() => fetchRegistrations(meta.current_page - 1)}
            className="text-slate-300 hover:text-slate-950 disabled:opacity-20 transition-all p-2 hover:scale-125 active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex gap-6">{renderPageNumbers()}</div>
          <button
            disabled={meta.current_page === meta.total_page}
            onClick={() => fetchRegistrations(meta.current_page + 1)}
            className="text-slate-300 hover:text-slate-950 disabled:opacity-20 transition-all p-2 hover:scale-125 active:scale-90"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
