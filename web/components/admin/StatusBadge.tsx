// components/admin/StatusBadge.tsx
import { cn } from "@/lib/utils";

export type RegStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export default function StatusBadge({ status }: { status: RegStatus }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    CANCELLED: "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
        styles[status] || styles.PENDING,
      )}
    >
      {status}
    </span>
  );
}
