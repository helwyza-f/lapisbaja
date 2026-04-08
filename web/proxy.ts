import { NextRequest, NextResponse } from "next/server";

// Daftar route yang butuh login
const protectedRoutes = ["/registrations", "/trainings", "/dashboard"];
// Daftar route yang HANYA bisa diakses kalau BELUM login
const authRoutes = ["/login"];

export function proxy(request: NextRequest) {
  // 1. Ambil token dari cookies (Next.js Proxy/Middleware lebih optimal baca cookies)
  // Catatan: Di client-side login tadi, pastikan simpan token di Cookies juga, bukan cuma LocalStorage
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Jika akses route PROTECTED tapi TIDAK ADA token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Jika akses route AUTH (login) tapi SUDAH ADA token
  if (authRoutes.includes(pathname) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/registrations";
    return NextResponse.redirect(url);
  }

  // 4. Jika route adalah root (/), arahkan berdasarkan status login
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = token ? "/registrations" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Config matcher agar proxy tidak jalan di file statis/api internal
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
