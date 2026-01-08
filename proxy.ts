// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/dashboard/projects") ||
    request.nextUrl.pathname.startsWith("/dashboard/datasets") ||
    request.nextUrl.pathname.startsWith("/dashboard/account");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const isAuthPage =
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup";
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/projects/:path*",
    "/dashboard/datasets/:path*",
    "/dashboard/account/:path*",
    "/dashboard/signin",
    "/dashboard/signup",
  ],
};
