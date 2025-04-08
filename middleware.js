import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken"); // Check if authToken exists

  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/signin", req.url)); // Redirect to login if not authenticated
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to /admin routes
};
