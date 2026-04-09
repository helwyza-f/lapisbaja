// components/admin/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const executeLogin = async () => {
    if (!formData.username || !formData.password) {
      setError("Please fill in all security fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/login", {
        username: formData.username,
        password: formData.password,
      });

      if (res.data?.data?.token) {
        setToken(res.data.data.token);
        // Pakai replace agar tidak bisa 'back' ke login
        router.replace("/dashboard");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid Security ID or Access Key.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Area */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="text-red-600 shrink-0" size={18} />
          <p className="text-xs font-bold text-red-600 italic flex-1">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Fields (Tanpa Tag Form untuk hindari reload) */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Security ID
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={18} strokeWidth={2.5} />
            </div>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && executeLogin()}
              className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold italic focus:bg-white transition-all"
              placeholder="Enter Username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Access Key
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && executeLogin()}
              className="h-14 pl-12 pr-12 rounded-2xl border-slate-100 bg-slate-50 font-bold italic focus:bg-white transition-all"
              placeholder="Enter Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="button"
          disabled={loading}
          onClick={executeLogin}
          className="w-full h-16 rounded-2xl bg-slate-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] transition-all group active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <div className="flex items-center gap-2">
              Authenticate{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
