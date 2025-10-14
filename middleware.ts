import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth status from cookie (we'll set this on login)
  const authToken = request.cookies.get("auth_token")
  const userRole = request.cookies.get("user_role")

  // Check if user is authenticated
  const isAuthenticated = !!authToken
  const isAdmin = userRole?.value === "admin"

  // Protect user routes (temporarily disabled for demo)
  // if (pathname.startsWith("/user") && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/user/food", request.url))
    }
  }

  // Redirect authenticated users away from login/register
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/user/food", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/login", "/register"],
}
