import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/auth/") || // Skip all NextAuth.js routes
    pathname.startsWith("/api/google/") || // Skip Google API routes
    pathname.startsWith("/api/business/") // Skip business API routes
  ) {
    return NextResponse.next();
  }

  // Allow public access to login and home
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/") {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/destination", "/destination/add"],
};
