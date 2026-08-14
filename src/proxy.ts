import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user.role;
  const isAuthenticated = !!req.auth;

  // /admin/login is a redirect-only stub (see src/app/admin/login/page.tsx)
  // — always let it through so it can forward to /login itself, rather
  // than getting caught by the admin-route guard below.
  const isAdminLoginStub = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminLoginStub;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "credit_union") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
