import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services(.*)",
  "/affiliates(.*)",
  "/resources(.*)",
  "/news(.*)",
  "/faq(.*)",
  "/contact(.*)",
  "/api/chatbot(.*)",
  "/api/contact(.*)",
  "/api/affiliates(.*)",
  "/api/homepage(.*)",
]);

const isAuthPage = createRouteMatcher(["/login(.*)", "/signup(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  const isAuthenticated = !!userId;
  const role = sessionClaims?.metadata?.role;

  // Logged-in users visiting /login or /signup get sent to their dashboard
  // instead of seeing the form again.
  if (isAuthPage(req) && isAuthenticated) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", req.url)
    );
  }
  if (isAuthPage(req)) {
    return NextResponse.next();
  }

  if (isAdminRoute(req)) {
    if (!isAuthenticated) {
      return authObject.redirectToSignIn({ returnBackUrl: req.url });
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (isDashboardRoute(req)) {
    if (!isAuthenticated) {
      return authObject.redirectToSignIn({ returnBackUrl: req.url });
    }
    if (role !== "credit_union") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
