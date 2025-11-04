import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Demo mode: rely on client-side localStorage only.
  // Middleware runs on the server/edge and cannot access localStorage,
  // so we avoid enforcing auth here for demo to keep flow simple.
  const isAuthenticated = false
  const isAdmin = false

  // Protect user routes (temporarily disabled for demo)
  // if (pathname.startsWith("/user") && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // Protect admin routes
  // For demo: do not block admin routes via middleware since auth lives in localStorage.
  // Use client-side checks/navigations instead (already implemented in layouts/pages).
  if (pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from login/register
  // For demo: never redirect away from login/register at middleware level.

  return NextResponse.next()
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/login", "/register"],
}
