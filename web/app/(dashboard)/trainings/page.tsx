"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  Loader2,
  AlertCircle,
  Banknote,
  FileText,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface Training {
  id: string;
  title: string;
  description: string;
  date_start: string;
  price: number;
}

export default function TrainingsPage() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
  });

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trainings");
      setTrainings(res.data.data || []);
    } catch (err) {
      toast.error("Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, "");
    if (!numberString) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(numberString));
  };

  const openModal = (t?: Training) => {
    if (t) {
      setSelectedDate(parseISO(t.date_start));
      setFormData({
        id: t.id,
        title: t.title,
        description: t.description,
        price: new Intl.NumberFormat("id-ID").format(t.price),
      });
    } else {
      setSelectedDate(undefined);
      setFormData({ id: "", title: "", description: "", price: "" });
    }
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return toast.warning("Pilih tanggal dulu, Boy!");

    setIsSubmitLoading(true);
    const numericPrice = parseInt(formData.price.replace(/[^0-9]/g, "")) || 0;

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date_start: selectedDate.toISOString(),
        price: numericPrice,
      };

      if (formData.id) {
        await api.put(`/trainings/${formData.id}`, payload);
        toast.success("Jadwal berhasil diperbarui");
      } else {
        await api.post("/trainings", payload);
        toast.success("Jadwal baru ditambahkan");
      }

      setIsOpen(false);
      fetchTrainings();
    } catch (err) {
      toast.error("Gagal menyimpan data");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTraining) return;
    try {
      await api.delete(`/trainings/${selectedTraining.id}`);
      toast.success("Jadwal berhasil dihapus");
      fetchTrainings();
    } catch (err) {
      toast.error("Gagal menghapus jadwal");
    } finally {
      setIsDeleteAlertOpen(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION - Konsisten dengan Regis Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Management Training
          </h1>
          <p className="text-slate-500 font-medium ml-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Control Center PT Lapis Baja Inspektindo
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-blue-200 rounded-2xl transition-all active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5 stroke-[3]" /> Tambah Jadwal
        </Button>
      </div>

      {/* TABLE SECTION - Pakai rounded-3xl & shadow-2xl */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Informasi Program
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Jadwal & Investasi
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Manajemen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600/30" />
                    <p className="text-slate-400 font-black tracking-widest text-xs uppercase animate-pulse">
                      Sinkronisasi Data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : trainings.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-32 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-black text-xl">
                    Belum Ada Jadwal
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Klik tombol tambah untuk membuat batch pelatihan baru.
                  </p>
                </td>
              </tr>
            ) : (
              trainings.map((t) => (
                <tr
                  key={t.id}
                  className="group hover:bg-blue-50/30 transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-blue-700 transition-colors uppercase">
                        {t.title}
                      </span>
                      <span className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1.5 uppercase tracking-tighter">
                        <MapPin className="h-3 w-3" />{" "}
                        {t.description || "Lokasi Belum Diset"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        {format(parseISO(t.date_start), "EEEE, d MMMM yyyy", {
                          locale: id,
                        })}
                      </span>
                      <span className="flex items-center gap-2 text-[11px] font-black text-blue-700 bg-blue-50 w-fit px-3 py-1 rounded-lg uppercase tracking-wider border border-blue-100">
                        <Banknote className="h-3.5 w-3.5" />
                        Rp {t.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/registrations?training_id=${t.id}`)
                        }
                        className="font-black text-[10px] h-10 px-5 uppercase tracking-widest border-slate-200 hover:bg-slate-50 shadow-sm rounded-xl"
                      >
                        <Users className="h-4 w-4 mr-2" /> Peserta
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => openModal(t)}
                        className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTraining(t);
                          setIsDeleteAlertOpen(true);
                        }}
                        className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM - Konsisten dengan Rounded-3xl & Header Blue */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[40px]">
          <div className="bg-blue-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              {formData.id ? "Update Batch" : "Tambah Batch"}
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1 font-medium">
              Konfigurasi detail paket pelatihan PT Lapis Baja.
            </DialogDescription>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  Judul Pelatihan
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="h-14 border-slate-200 focus:ring-blue-500 font-bold text-slate-900 rounded-2xl"
                  placeholder="Contoh: Coating Inspection Batch 10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  Lokasi / Metode
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-14 border-slate-200 rounded-2xl font-medium text-slate-700"
                  placeholder="Contoh: Batam Center / Online Zoom"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Tanggal
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-14 w-full justify-start font-bold border-slate-200 rounded-2xl",
                          !selectedDate && "text-slate-400",
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-blue-600" />
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy")
                          : "Pilih tgl"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={id}
                        initialFocus
                        className="rounded-3xl border shadow-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                    Investasi (Rp)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: formatRupiah(e.target.value),
                        })
                      }
                      required
                      className="h-14 pl-4 border-slate-200 font-black text-blue-700 rounded-2xl"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 sm:justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitLoading}
                className="bg-blue-600 hover:bg-blue-700 h-14 px-10 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                {isSubmitLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Simpan Jadwal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DELETE - Konsisten dengan Rounded-40px */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-[40px] border-none shadow-2xl p-10 max-w-sm">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 rounded-[32px] flex items-center justify-center mb-6 shadow-inner">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Hapus Batch?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-sm mt-4 px-2">
              Anda akan menghapus{" "}
              <span className="font-black text-slate-900 underline">
                "{selectedTraining?.title}"
              </span>
              . Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 flex-col sm:flex-col gap-3">
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full bg-red-600 hover:bg-red-700 font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              Ya, Hapus Sekarang
            </AlertDialogAction>
            <AlertDialogCancel className="w-full border-none font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 h-10">
              Batalkan
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
