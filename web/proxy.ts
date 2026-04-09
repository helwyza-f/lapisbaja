// web/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Dashboard Protection: Cegah akses tanpa token
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Auth Page Guard: Jika sudah login, jangan biarkan akses ke /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Admin Landing: Jika akses ke root area admin (/admin), arahkan ke dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Jalankan proxy hanya pada route admin dan dashboard
    "/dashboard/:path*",
    "/login",
    "/admin/:path*",
  ],
};
