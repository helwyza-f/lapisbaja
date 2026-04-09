// app/(admin)/login/page.tsx
import LoginForm from "@/components/admin/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 selection:bg-primary/20">
      {/* Top Border Accent */}
      <div className="fixed top-0 inset-x-0 h-1.5 bg-slate-950" />

      <div className="w-full max-w-[400px] space-y-8">
        {/* Header Section (RSC) */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 text-white shadow-xl">
            <ShieldCheck size={28} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
              ADMIN <span className="text-slate-400">PORTAL.</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              PT Lapis Baja Inspektindo
            </p>
          </div>
        </div>

        {/* Client Component Form */}
        <LoginForm />

        {/* System Footer (RSC) */}
        <div className="pt-8 text-center border-t border-slate-100">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Control Panel v2.1 • Secured Connection
          </p>
        </div>
      </div>
    </div>
  );
}
