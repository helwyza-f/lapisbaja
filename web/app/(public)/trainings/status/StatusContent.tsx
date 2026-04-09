// app/trainings/status/StatusContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Upload,
  CheckCircle,
  Clock,
  CreditCard,
  RefreshCcw,
  ChevronLeft,
  ShieldCheck,
  Search,
  ArrowRight,
  AlertTriangle,
  X,
  Loader2,
  ImageIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identifier = searchParams.get("identifier");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const fetchStatus = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/register/check?identifier=${id}`);
      if (res.data?.data) {
        setData(res.data.data);
      } else {
        throw new Error("No data");
      }
    } catch (err) {
      setData(null);
      toast.error("Data tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) fetchStatus(identifier);
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [identifier]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar (Max 5MB)");
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!file || !data) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("proof", file);

    try {
      await api.patch(`/registrations/${data.registration_id}/proof`, formData);
      toast.success("Bukti Berhasil Diperbarui!");
      clearFile();
      fetchStatus(identifier!);
    } catch (err: any) {
      toast.error("Gagal Mengunggah");
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/trainings/status?identifier=${searchInput.trim()}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <Loader2 className="text-primary animate-spin mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Syncing Status...
        </p>
      </div>
    );

  if (!identifier || !data) {
    return (
      <section className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-md w-full space-y-8 relative z-10 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center shadow-2xl">
              <Search className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Track Status.
            </h1>
            <p className="text-slate-400 text-xs font-medium italic">
              Masukkan Email atau Nomor WA pendaftaran.
            </p>
          </div>
          <form onSubmit={handleSearch} className="space-y-3">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email / WhatsApp..."
              className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-bold px-6 focus:border-primary transition-all text-center"
            />
            <Button className="w-full h-16 bg-primary hover:bg-white hover:text-slate-950 text-white font-black uppercase tracking-widest rounded-2xl transition-all group">
              Check Now{" "}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          <Link
            href="/trainings"
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={14} /> Back to Trainings
          </Link>
        </div>
      </section>
    );
  }

  const isApproved = data.status === "APPROVED";
  const isRejected = data.status === "REJECTED";
  const hasProof = data.proof_url && data.proof_url !== "";

  return (
    <section className="py-24 md:py-32 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header Status */}
          <div
            className={`p-10 text-center space-y-2 relative ${isApproved ? "bg-emerald-600" : isRejected ? "bg-red-600" : "bg-slate-950"} text-white transition-all duration-500`}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/50 mb-1">
                Registration Status
              </p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                {data.status}
              </h2>
            </div>
          </div>

          <div className="p-8 md:p-14 space-y-10">
            {/* Info Peserta & Training */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Clock size={10} /> Program
                </p>
                <h3 className="text-sm font-black text-slate-950 uppercase italic leading-tight">
                  {data.training_title}
                </h3>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ShieldCheck size={10} /> Student
                </p>
                <h3 className="text-sm font-black text-slate-950 uppercase italic leading-tight">
                  {data.name}
                </h3>
              </div>
            </div>

            {/* Bukti Yang Sudah Ada (Preview Terakhir) */}
            {hasProof && !previewUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <ImageIcon size={14} className="text-primary" />
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    Last Uploaded Proof
                  </h4>
                </div>
                <div className="relative group rounded-3xl overflow-hidden aspect-video border-2 border-slate-100">
                  <img
                    src={data.proof_url}
                    alt="Latest Proof"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      className="rounded-full font-black text-[10px] uppercase italic"
                      onClick={() => window.open(data.proof_url, "_blank")}
                    >
                      <Eye size={14} className="mr-2" /> View Original
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isApproved && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Bank Target */}
                <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
                  <div className="relative z-10 flex justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        Transfer Payment
                      </p>
                      <p className="text-xl font-black italic">
                        Bank Mandiri / BCA
                      </p>
                    </div>
                    <CreditCard size={28} className="text-primary/50" />
                  </div>
                  <div className="relative z-10 pt-4 border-t border-white/5">
                    <p className="text-2xl font-black tracking-[0.1em] text-primary leading-none">
                      123 4567 8901
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic">
                      A/N PT LAPIS BAJA INSPEKTINDO
                    </p>
                  </div>
                </div>

                {/* Upload Section (Update/New) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                      {hasProof
                        ? "Update/Re-upload Proof"
                        : "Upload Payment Proof"}
                    </h4>
                    {isRejected && (
                      <span className="flex items-center gap-1 text-red-500 text-[9px] font-black uppercase italic animate-pulse">
                        <AlertTriangle size={12} /> Invalid proof, please
                        re-upload
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    {!previewUrl ? (
                      <div className="relative h-40 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 hover:border-primary transition-all group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <Upload
                          className="text-slate-300 group-hover:text-primary mb-2 transition-transform group-hover:-translate-y-1"
                          size={28}
                        />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Select New Receipt
                        </p>
                      </div>
                    ) : (
                      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border-2 border-primary shadow-2xl animate-in zoom-in">
                        <img
                          src={previewUrl}
                          alt="New Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={clearFile}
                          className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {previewUrl && (
                    <Button
                      disabled={uploading}
                      onClick={handleUpload}
                      className="w-full h-16 bg-primary hover:bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20"
                    >
                      {uploading ? (
                        <RefreshCcw className="animate-spin" />
                      ) : (
                        "Verify & Upload"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {isApproved && (
              <div className="p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-900 uppercase italic">
                    Registration Verified
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium italic">
                    Pembayaran Anda telah divalidasi. Tim kami akan segera
                    berkoordinasi via WhatsApp.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setData(null);
                setSearchInput("");
                router.push("/trainings/status");
              }}
              className="w-full py-4 text-[9px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.4em] border-t border-slate-50 mt-6"
            >
              Search Another Identity
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
