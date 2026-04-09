// app/(admin)/dashboard/layout.tsx
import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header Dashboard */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Internal Control Systems
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-950 italic">
                Administrator
              </p>
              <p className="text-[9px] font-bold text-slate-400">
                Lapis Baja Inspektindo
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200" />
          </div>
        </header>

        {/* Content Area */}
        <main className="p-10">{children}</main>
      </div>
    </div>
  );
}
