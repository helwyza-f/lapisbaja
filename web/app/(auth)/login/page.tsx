"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { username, password });

      const { token, user } = res.data.data;

      // Simpan credentials
      Cookies.set("token", token, { expires: 1, path: "/" });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Berhasil!", {
        description: `Selamat bertugas, ${user.full_name || user.username}`,
      });

      router.push("/registrations");
      router.refresh();
    } catch (error: any) {
      console.log("Login attempt failed:", error.response?.status);

      const errorMessage =
        error.response?.data?.error || "Username atau Password salah!";

      toast.error("Akses Ditolak", {
        description: errorMessage,
      });
      // Tidak melakukan throw error lagi agar Next.js Overlay tidak muncul
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] px-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-2 pb-8 pt-10">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 shadow-lg shadow-blue-200">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-center text-3xl font-black tracking-tight text-blue-950">
            PT LAPIS BAJA
          </CardTitle>
          <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest">
            Internal Management
          </p>
        </CardHeader>
        <CardContent className="pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <Input
                  type="text"
                  placeholder="admin_lapisbaja"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 pr-10 h-12 border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-700 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-950 h-12 text-white font-extrabold text-base transition-all shadow-lg shadow-blue-100 active:scale-[0.97]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
