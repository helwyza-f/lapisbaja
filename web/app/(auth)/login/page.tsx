"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie"; // Import ini Boy

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { username, password });
      const { token, user } = res.data.data;

      // 1. Simpan di Cookies supaya proxy.ts bisa baca di level server
      // Kita set expires 1 hari biar nggak bolak-balik login
      Cookies.set("token", token, { expires: 1, path: "/" });

      // 2. Simpan di localStorage buat backup & info user di UI
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 3. Redirect ke dashboard
      // Gunakan push lalu refresh supaya state proxy/middleware terbaru terbaca
      router.push("/registrations");
      router.refresh();
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(
        error.response?.data?.message || "Login gagal, cek username/password!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold text-blue-900">
            PT Lapis Baja
          </CardTitle>
          <p className="text-center text-sm text-gray-500 italic">
            Administrator System
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                type="text"
                placeholder="admin_lapisbaja"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Memverifikasi...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
