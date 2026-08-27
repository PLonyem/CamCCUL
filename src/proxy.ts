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
  "/loan-calculator(.*)",
  "/api/chatbot(.*)",
  "/api/contact(.*)",
  "/api/affiliates(.*)",
  "/api/homepage(.*)",
  "/api/announcements(.*)",
  "/api/loan-products(.*)",
  "/api/simulations/calculate",
  "/api/signup/credit-union/check",
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
    // Role is NOT checked here on purpose — a signed-in account with no
    // role yet is a pending/rejected credit union signup (see /signup),
    // and dashboard/layout.tsx + dashboard/page.tsx already handle that
    // case (showing a review-status screen) as well as redirecting admins
    // to /admin. This block used to redirect role !== "credit_union"
    // straight to "/" here too, which silently overrode that fix — this
    // exact middleware check runs before any page code, so it was the
    // real reason "/dashboard" kept bouncing to "/" for pending accounts.
    return NextResponse.next();
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
