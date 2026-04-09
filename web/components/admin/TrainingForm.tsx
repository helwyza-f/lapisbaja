// components/admin/TrainingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Calendar as CalendarIcon,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function TrainingForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date_start ? new Date(initialData.date_start) : undefined,
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
  });

  // --- INDUSTRIAL CURRENCY FORMATTER ---
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, price: Number(rawValue) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("MISSING_DATA: Please select a deployment schedule");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        date_start: date.toISOString(),
      };

      if (initialData?.id) {
        await api.put(`/trainings/${initialData.id}`, payload);
        toast.success("SYSTEM: Program synchronized with core server");
      } else {
        await api.post("/trainings", payload);
        toast.success("SYSTEM: New technical program deployed");
      }

      router.push("/dashboard/trainings");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-12 animate-in fade-in duration-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* TITLE SECTION - INDUSTRIAL HEADLINE */}
        <div className="space-y-4 md:col-span-2 border-b border-slate-100 pb-8">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
            <Cpu size={14} className="text-primary" /> Official Program
            Identification
          </label>
          <Input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="h-20 text-3xl font-black uppercase italic tracking-tighter rounded-none border-b-4 border-x-0 border-t-0 border-slate-100 bg-transparent focus-visible:ring-0 focus-visible:border-slate-950 transition-all placeholder:text-slate-100"
            placeholder="ENTER OFFICIAL TITLE..."
          />
        </div>

        {/* INVESTMENT SECTION */}
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            Resource Investment (IDR)
          </label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 group-focus-within:text-primary transition-colors">
              CUR_
            </span>
            <Input
              required
              type="text"
              value={formData.price === 0 ? "" : formatRupiah(formData.price)}
              onChange={handlePriceChange}
              className="h-16 pl-16 rounded-2xl bg-slate-50 border-none font-black text-xl italic focus-visible:ring-2 focus-visible:ring-slate-900/5 shadow-inner transition-all"
              placeholder="Rp 0"
            />
          </div>
        </div>

        {/* CALENDAR SECTION - FIXED TRANSPARENCY */}
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            Standard Deployment Schedule
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-16 justify-start text-left font-black text-sm rounded-2xl bg-slate-50 border-none px-6 hover:bg-slate-100 transition-all shadow-inner",
                  !date && "text-slate-400",
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                {date ? (
                  format(date, "PPPP")
                ) : (
                  <span className="uppercase tracking-[0.2em] text-[10px] opacity-60">
                    Initialize Schedule
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            {/* FIX: Tambahkan bg-white shadow-2xl dan border-slate-200 */}
            <PopoverContent
              className="w-auto p-0 rounded-2xl border border-slate-200 bg-white shadow-2xl z-[80]"
              align="start"
            >
              {/* FIX: Paksa background kalender putih */}
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-4 bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="space-y-4 md:col-span-2">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            Technical Syllabus & Operational Standards
          </label>
          <Textarea
            required
            rows={10}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="rounded-[2.5rem] bg-slate-50 border-none p-10 font-bold text-sm leading-relaxed focus-visible:ring-2 focus-visible:ring-slate-900/5 transition-all shadow-inner placeholder:italic placeholder:text-slate-300"
            placeholder="Outline the training scope, international certification (API/AWS/ASNT), and technical duration..."
          />
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="pt-12 flex items-center justify-between border-t border-slate-100">
        <div className="hidden lg:flex items-center gap-3 text-slate-300">
          <ShieldAlert size={16} />
          <p className="text-[9px] font-black uppercase tracking-[0.3em]">
            Status:{" "}
            <span className="text-emerald-500">Authorized for Broadcast</span>
          </p>
        </div>
        <Button
          disabled={loading}
          className="w-full lg:w-auto h-16 px-16 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary transition-all gap-4 shadow-2xl shadow-slate-950/20 active:scale-95 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save
                size={20}
                className="group-hover:translate-y-[-2px] transition-transform"
              />
              SYNCHRONIZE DATA
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
