// components/public/trainings/RegistrationForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function RegistrationForm({
  trainingId,
}: {
  trainingId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // 1. Ambil data dari elemen form
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // 2. Tambahkan training_id secara manual (karena dia dari props, bukan input)
    formData.append("training_id", trainingId);

    // DEBUG: Cek isi formData di console kalau perlu
    // for (let [key, value] of formData.entries()) { console.log(key, value); }

    try {
      // 3. Kirim formData, bukan object JSON biasa {}
      await api.post("/register", formData);

      toast.success("Pendaftaran Terkirim!", {
        description: "Mengarahkan ke halaman instruksi pembayaran...",
      });

      const identifier = formData.get("email");
      setTimeout(() => {
        router.push(`/trainings/status?identifier=${identifier}`);
      }, 1500);
    } catch (error: any) {
      console.error("Payload Error:", error.response?.data);
      toast.error("Gagal Mendaftar", {
        description:
          error.response?.data?.message || "Pastikan format form benar.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 md:p-12 bg-white flex flex-col gap-6"
    >
      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2 group">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors ml-1">
            Full Name
          </Label>
          <Input
            name="name"
            required
            autoComplete="name"
            className="rounded-2xl border-slate-100 bg-slate-50 h-14 md:h-16 font-bold text-sm md:text-base focus:bg-white transition-all px-6 border-2 focus:border-primary/30"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Email */}
          <div className="space-y-2 group">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors ml-1">
              Email Address
            </Label>
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-2xl border-slate-100 bg-slate-50 h-14 md:h-16 font-bold text-sm focus:bg-white transition-all px-6 border-2 focus:border-primary/30"
              placeholder="name@company.com"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2 group">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors ml-1">
              WhatsApp Number
            </Label>
            <Input
              name="phone"
              required
              type="tel"
              autoComplete="tel"
              className="rounded-2xl border-slate-100 bg-slate-50 h-14 md:h-16 font-bold text-sm focus:bg-white transition-all px-6 border-2 focus:border-primary/30"
              placeholder="081234567890"
            />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-2 group">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors ml-1">
            Company / Institution (Optional)
          </Label>
          <Input
            name="agency"
            autoComplete="organization"
            className="rounded-2xl border-slate-100 bg-slate-50 h-14 md:h-16 font-bold text-sm focus:bg-white transition-all px-6 border-2 focus:border-primary/30"
            placeholder="Enter company name"
          />
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-16 md:h-20 bg-primary hover:bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-3 italic">
              Proceed to Payment
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform"
              />
            </span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            Data Secured & Encrypted
          </span>
        </div>
      </div>
    </form>
  );
}
