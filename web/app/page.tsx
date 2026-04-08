"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Cek apakah ada token di localStorage
    const token = localStorage.getItem("token");

    // 2. Logic redirect
    if (!token) {
      // Kalau gak ada token, paksa ke halaman login
      router.push("/login");
    } else {
      // Kalau sudah ada token, langsung ke dashboard registrations
      router.push("/registrations");
    }
  }, [router]);

  // Sambil nunggu useEffect (redirect), kita kasih loading screen simpel
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-900 mx-auto" />
        <h1 className="text-lg font-medium text-gray-600">
          Menyiapkan akses Lapis Baja...
        </h1>
      </div>
    </div>
  );
}
