import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/affiliates",
  "/resources",
  "/news",
  "/faq",
  "/contact",
  "/login",
  "/signup",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user.role;
  const isAuthenticated = !!req.auth;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    // Logged-in users visiting /login or /signup get sent to their dashboard
    // instead of seeing the form again.
    if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "credit_union") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
