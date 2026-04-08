"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie"; // Wajib import ini

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Cek token di Cookies (sesuai yang dibaca proxy.ts)
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    // 1. Hapus Cookie (Ini yang paling penting buat proxy.ts)
    Cookies.remove("token", { path: "/" });

    // 2. Bersihkan localStorage (Data user & backup token)
    localStorage.clear();

    // 3. Redirect ke login
    router.push("/login");

    // 4. Force refresh supaya proxy.ts sadar token sudah hilang
    router.refresh();
  };

  if (!authorized) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-blue-950 text-white p-6 space-y-6 shrink-0">
        <h2 className="text-xl font-bold border-b border-blue-800 pb-4">
          CMS Baja
        </h2>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/registrations"
            className="hover:bg-blue-800 p-2 rounded transition-colors"
          >
            Pendaftar
          </Link>
          <Link
            href="/trainings"
            className="hover:bg-blue-800 p-2 rounded transition-colors"
          >
            Jadwal Training
          </Link>
          <button
            onClick={handleLogout}
            className="text-left hover:bg-red-900/50 p-2 rounded text-red-300 mt-4 border border-red-900/30"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  );
}
