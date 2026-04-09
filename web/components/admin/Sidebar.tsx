// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Registrations", href: "/dashboard/registrations", icon: Users },
  { name: "Trainings", href: "/dashboard/trainings", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("lapisbaja_token");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-72 bg-slate-950 min-h-screen flex flex-col border-r border-white/5 sticky top-0">
      {/* Branding */}
      <div className="p-8">
        <div className="flex items-center gap-3 text-white">
          <ShieldCheck className="text-primary" size={28} />
          <div className="flex flex-col">
            <span className="font-black italic tracking-tighter leading-none">
              LAPIS BAJA
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menus.map((menu) => {
          // --- SMART ACTIVE LOGIC ---
          const isActive =
            menu.href === "/dashboard"
              ? pathname === "/dashboard" // Exact match cuma buat dashboard utama
              : pathname.startsWith(menu.href); // Link dalam (detail/edit/applicants) bakal tetep nyala

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <menu.icon
                size={20}
                className={cn(
                  isActive
                    ? "text-white"
                    : "group-hover:text-primary transition-colors",
                )}
              />
              <span className="text-xs font-black uppercase tracking-widest">
                {menu.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
