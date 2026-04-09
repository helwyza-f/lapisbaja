// app/(admin)/dashboard/registrations/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Building2,
  Clock,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RegistrationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/registrations/${id}`);
      setData(res.data?.data);
    } catch (err) {
      toast.error("Registry record not found");
      router.push("/dashboard/registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (status: "APPROVED" | "REJECTED") => {
    try {
      setActionLoading(true);
      await api.patch(`/registrations/${id}/status`, { status });
      toast.success(`SYSTEM: Status updated to ${status}`);
      fetchDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Internal Action Failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-slate-900" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          Syncing with Industrial Server...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center h-14 w-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-950 transition-all active:scale-90"
          >
            <ArrowLeft
              className="text-slate-400 group-hover:text-white transition-colors"
              size={24}
            />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">
                REGISTRY <span className="text-primary">DETAILS.</span>
              </h1>
              <StatusBadge status={data.status} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 font-mono tracking-widest uppercase italic">
              UniqueID: {data.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT AREA: Data Profile & Training (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* PERSONAL INFORMATION CARD */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 flex items-center gap-3">
              <User size={16} className="text-primary" /> Participant
              Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              <DataField
                label="Full Identification Name"
                value={data.name}
                isHeading
              />
              <DataField
                label="Agency / Company"
                value={data.agency || "INDEPENDENT PARTICIPANT"}
                icon={<Building2 size={14} />}
              />
              <DataField
                label="Contact Email"
                value={data.email}
                icon={<Mail size={14} />}
              />
              <DataField
                label="WhatsApp / Phone"
                value={data.phone}
                icon={<Phone size={14} />}
              />
            </div>
          </section>

          {/* TRAINING PROGRAM CARD */}
          <section className="bg-slate-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={180} />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 relative z-10">
              Enrolled Industrial Program
            </h2>
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] italic">
                  Active Selection:
                </p>
                <p className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight max-w-2xl">
                  {data.training_title}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-10 pt-8 border-t border-white/5">
                <DataField
                  label="Application Timestamp"
                  value={format(
                    new Date(data.created_at),
                    "eeee, dd MMMM yyyy",
                  )}
                  isDark
                />
                <DataField
                  label="Clock"
                  value={format(new Date(data.created_at), "HH:mm:ss 'WIB'")}
                  isDark
                  icon={<Clock size={14} />}
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT AREA: Verification & Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* PROOF OF PAYMENT CARD */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-3">
              <AlertCircle size={16} className="text-primary" /> Visual
              Verification
            </h2>

            <div className="relative aspect-[3/4] rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden group shadow-inner">
              {data.proof_url ? (
                <>
                  <img
                    src={data.proof_url}
                    alt="Payment Proof"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6 backdrop-blur-[2px]">
                    <Button
                      variant="secondary"
                      className="w-full font-black text-[10px] uppercase tracking-widest h-12 rounded-xl shadow-2xl"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <Maximize2 size={16} className="mr-3" /> Inspect Document
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center opacity-30">
                  <AlertCircle size={48} strokeWidth={1} />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest leading-tight">
                    Waiting for Image Upload
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SYSTEM CONTROL PANEL */}
          <section className="bg-white border-2 border-slate-950 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950 italic underline underline-offset-8">
                COMMAND CENTER
              </h2>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => handleUpdateStatus("APPROVED")}
                disabled={actionLoading || data.status === "APPROVED"}
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.25em] text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "AUTHORIZE REGISTRATION"
                )}
              </Button>
              <Button
                onClick={() => handleUpdateStatus("REJECTED")}
                disabled={actionLoading || data.status === "REJECTED"}
                variant="outline"
                className="w-full h-16 border-slate-200 text-red-600 hover:bg-red-50 font-black uppercase tracking-[0.25em] text-[10px] rounded-2xl active:scale-95 transition-all"
              >
                DENY APPLICATION
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 animate-in fade-in duration-300">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-10 right-10 h-16 w-16 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <X size={32} />
          </button>
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={data.proof_url}
              alt="Preview"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm border border-white/5"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENT: Data Field Reusable
function DataField({ label, value, isHeading, icon, isDark }: any) {
  return (
    <div className="space-y-2 group">
      <p
        className={cn(
          "text-[10px] font-black uppercase tracking-[0.3em] transition-colors",
          isDark ? "text-slate-500" : "text-slate-400 group-hover:text-primary",
        )}
      >
        {label}
      </p>
      <div className="flex items-center gap-3">
        {icon && (
          <span className={isDark ? "text-slate-600" : "text-slate-200"}>
            {icon}
          </span>
        )}
        <p
          className={cn(
            "font-bold tracking-tight",
            isHeading
              ? "text-2xl font-black italic uppercase text-slate-950 leading-none"
              : "text-[15px] text-slate-700",
            isDark && "text-white",
          )}
        >
          {value || "NOT SPECIFIED"}
        </p>
      </div>
    </div>
  );
}
