import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper Shadcn untuk merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke Rupiah untuk harga training
 * Contoh: 1000000 -> Rp 1.000.000
 */
export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ISO ke format Indonesia untuk jadwal pelatihan
 * Contoh: 2026-04-09 -> 9 April 2026
 */
export function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
