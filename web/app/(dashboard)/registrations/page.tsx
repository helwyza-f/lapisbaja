"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Registration, PagedResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeft,
  SearchX,
  Building2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-50/50">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
      }
    >
      <RegistrationContent />
    </Suspense>
  );
}

function RegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trainingId = searchParams.get("training_id");

  const [data, setData] = useState<PagedResponse<Registration> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusAction, setStatusAction] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRegistrations = async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        ...(trainingId && { training_id: trainingId }),
      });

      const res = await api.get(`/registrations?${params.toString()}`);
      setData(res.data.data);
    } catch (error) {
      toast.error("Gagal memuat data pendaftar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(page);
  }, [page, trainingId]);

  const handleUpdateStatus = async () => {
    if (!statusAction) return;
    setIsUpdating(true);
    try {
      await api.patch(`/registrations/${statusAction.id}/status`, {
        status: statusAction.status,
      });
      toast.success(
        `Pendaftaran ${statusAction.status === "APPROVED" ? "Disetujui" : "Ditolak"}`,
      );
      fetchRegistrations(page);
    } catch (error) {
      toast.error("Gagal mengubah status");
    } finally {
      setIsUpdating(false);
      setStatusAction(null);
    }
  };

  // Ambil info batch dari data yang sudah di-JOIN oleh Go
  const currentBatchName = data?.items?.[0]?.training_title;

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {trainingId && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/trainings")}
                className="h-10 w-10 rounded-2xl border-slate-200 hover:bg-white shadow-sm transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </Button>
            )}
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              {trainingId ? "Database Peserta" : "Monitoring Pendaftar"}
            </h1>
          </div>
          <p className="text-slate-500 font-medium ml-1 flex items-center gap-2">
            {trainingId ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Batch:{" "}
                <span className="text-slate-900 font-bold">
                  {currentBatchName || "Sedang memuat..."}
                </span>
              </span>
            ) : (
              "Monitoring pendaftaran masuk dari seluruh unit pelatihan."
            )}
          </p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Biodata
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Instansi & Program
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Status Verifikasi
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600/30" />
                    <p className="text-slate-400 font-black tracking-widest text-xs uppercase animate-pulse">
                      Menghubungkan ke Mac Mini Helwiza...
                    </p>
                  </div>
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-32 text-center space-y-5">
                  <div className="bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto rotate-12 group-hover:rotate-0 transition-transform">
                    <SearchX className="h-12 w-12 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-black text-2xl tracking-tight">
                      Tidak Ada Data
                    </p>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">
                      Belum ada aktivitas pendaftaran pada periode atau batch
                      ini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.items.map((reg) => (
                <tr
                  key={reg.id}
                  className="group hover:bg-blue-50/40 transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-blue-700 transition-colors">
                        {reg.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-black mt-1 tracking-tighter uppercase">
                        {reg.email}{" "}
                        <span className="mx-2 text-slate-200">/</span>{" "}
                        {reg.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Building2 className="h-4 w-4 text-blue-600/50" />
                        <span className="text-sm font-bold tracking-tight">
                          {reg.agency}
                        </span>
                      </div>
                      {!trainingId && (
                        <span className="text-[9px] bg-blue-100/50 text-blue-700 px-2.5 py-1 rounded-lg font-black w-fit uppercase tracking-wider">
                          {reg.training_title}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-2xl w-fit border shadow-sm",
                        reg.status === "APPROVED"
                          ? "bg-green-50 border-green-100"
                          : reg.status === "REJECTED"
                            ? "bg-red-50 border-red-100"
                            : "bg-amber-50 border-amber-100",
                      )}
                    >
                      {reg.status === "APPROVED" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {reg.status === "REJECTED" && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {reg.status === "PENDING" && (
                        <Clock className="h-4 w-4 text-amber-500 shadow-sm animate-spin-slow" />
                      )}
                      <span
                        className={cn(
                          "text-[10px] font-black tracking-[0.1em] uppercase",
                          reg.status === "APPROVED"
                            ? "text-green-700"
                            : reg.status === "REJECTED"
                              ? "text-red-700"
                              : "text-amber-700",
                        )}
                      >
                        {reg.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-black text-[10px] h-10 px-5 uppercase tracking-widest border-slate-200 hover:bg-slate-50 shadow-sm rounded-xl"
                        onClick={() => window.open(reg.proof_url)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Bukti
                      </Button>

                      {reg.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 h-10 px-5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 rounded-xl"
                            onClick={() =>
                              setStatusAction({
                                id: reg.id,
                                status: "APPROVED",
                              })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl"
                            onClick={() =>
                              setStatusAction({
                                id: reg.id,
                                status: "REJECTED",
                              })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      {!loading && data && data.meta.total_page > 1 && (
        <div className="mt-8 flex items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/40">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Halaman{" "}
            <span className="text-blue-600 text-sm font-black">{page}</span> /{" "}
            {data.meta.total_page}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="font-black text-[10px] border-slate-200 h-11 px-8 rounded-2xl uppercase tracking-widest transition-all hover:translate-x-[-2px]"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.meta.total_page}
              onClick={() => setPage(page + 1)}
              className="font-black text-[10px] border-slate-200 h-11 px-8 rounded-2xl uppercase tracking-widest transition-all hover:translate-x-[2px]"
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      <AlertDialog
        open={!!statusAction}
        onOpenChange={() => setStatusAction(null)}
      >
        <AlertDialogContent className="rounded-[40px] border-none shadow-2xl p-10 max-w-sm">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div
              className={cn(
                "w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 shadow-inner",
                statusAction?.status === "APPROVED"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600",
              )}
            >
              {statusAction?.status === "APPROVED" ? (
                <CheckCircle className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>
            <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Verifikasi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mt-4 px-2">
              Lanjutkan mengubah status pendaftaran menjadi{" "}
              <span
                className={cn(
                  "font-black decoration-2 underline-offset-4",
                  statusAction?.status === "APPROVED"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {statusAction?.status}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 flex-col sm:flex-col gap-3">
            <AlertDialogAction
              onClick={handleUpdateStatus}
              className={cn(
                "w-full font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg transition-transform active:scale-95",
                statusAction?.status === "APPROVED"
                  ? "bg-green-600 hover:bg-green-700 shadow-green-200"
                  : "bg-red-600 hover:bg-red-700 shadow-red-200",
              )}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Ya, Konfirmasi"
              )}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full border-none font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 h-10">
              Batal
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
