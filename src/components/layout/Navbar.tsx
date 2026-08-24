"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  LayoutDashboard,
  FileText,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { type TranslationKey } from "@/lib/i18n";
import logo from "../../../public/logo.jpg";

const navLinks: { key: TranslationKey; href: string }[] = [
  { key: "nav_home", href: "/" },
  { key: "nav_about", href: "/about" },
  { key: "nav_services", href: "/services" },
  { key: "nav_resources", href: "/resources" },
  { key: "nav_news", href: "/news" },
  { key: "nav_faq", href: "/faq" },
  { key: "nav_contact", href: "/contact" },
];

const serviceLinks: { key: TranslationKey; href: string }[] = [
  { key: "nav_services_regulatory", href: "/services/regulatory-supervision" },
  { key: "nav_services_auditing", href: "/services/financial-auditing" },
  { key: "nav_services_capacity", href: "/services/capacity-building" },
  { key: "nav_services_digitalization", href: "/services/digitalization" },
];

const aboutLinks: { key: TranslationKey; href: string }[] = [
  { key: "home_about_title", href: "/about" },
  { key: "home_services_title", href: "/services" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const role = user?.publicMetadata.role;
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomepage = pathname === "/";
  // Lazy-initialized to the common case (fresh homepage load starts at
  // scrollY 0) so there's no flash of the solid header before the effect
  // below can measure scroll position on mount.
  const [scrolledPastTop, setScrolledPastTop] = useState(() => !isHomepage);
  // Guards the transparent-over-hero state: if the hero photo itself never
  // loads, there's nothing for white nav text to sit on, so fall straight
  // through to the solid bar instead of risking white-on-white. Set by a
  // window event the hero's <img onError> dispatches (Navbar and the hero
  // are siblings — the hero lives in HomeClient, not inside this component).
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  // The homepage's hero section can be hidden entirely via the Homepage
  // Editor's Sections tab (showHero=false) — in that case the page's first
  // section is something with a light background (stats/value cards/etc),
  // and white nav text would be illegible over it. Checked once per
  // pathname since it reflects whatever the server actually rendered, not
  // something that changes without a navigation.
  const [heroPresent, setHeroPresent] = useState(true);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
      if (isHomepage) setScrolledPastTop(window.scrollY > 80);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  useEffect(() => {
    function handleHeroImageError() {
      setHeroImageFailed(true);
    }
    window.addEventListener("hero-image-error", handleHeroImageError);
    return () => window.removeEventListener("hero-image-error", handleHeroImageError);
  }, []);

  useEffect(() => {
    setHeroPresent(isHomepage && !!document.getElementById("home-hero"));
  }, [isHomepage]);

  // Two independent questions: which colour scheme reads legibly (white
  // chrome the whole time we're on the hero-bearing homepage, regardless of
  // scroll position — vs. the plain dark-on-white bar everywhere else), and
  // whether the bar itself is still fully transparent over the photo or has
  // solidified into the blurred brand-blue surface. Every other page (and a
  // homepage with its hero toggled off) keeps the plain white bar.
  const lightChrome = isHomepage && heroPresent;
  const atHeroTop = lightChrome && !scrolledPastTop && !isOpen && !heroImageFailed;

  const focusRing = cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    lightChrome
      ? "focus-visible:ring-white focus-visible:ring-offset-primary-900"
      : "focus-visible:ring-primary-500 focus-visible:ring-offset-white"
  );

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) so the menu never flashes open on the destination page.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // The mobile menu portals straight to <body> instead of rendering inside
  // this header. The homepage hero uses `isolate` (to contain its grain
  // layer's mix-blend-mode so it doesn't bleed onto content outside the
  // hero) — isolate + mix-blend-mode is a known trigger for mobile Safari
  // compositing this fixed menu *behind* that isolated stacking context
  // regardless of z-index, when the menu is nested inside a sibling of it.
  // Portaling escapes that entirely: document.body has no isolation of its
  // own, so ordinary z-index rules apply. document.body doesn't exist
  // during SSR, hence the mount guard.
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  function toggleLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }

  function closeMobileMenu() {
    setIsOpen(false);
  }

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const languageToggle = (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("nav_language_aria")}
      className={cn(
        "inline-flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-lg transition-colors",
        focusRing,
        lightChrome
          ? "text-white hover:bg-white/10"
          : "text-primary-700 hover:bg-primary-50"
      )}
    >
      <Globe className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase">{language}</span>
    </button>
  );

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" });
  }

  const signOutButton = (
    <button
      type="button"
      onClick={handleSignOut}
      title="Sign Out"
      aria-label="Sign Out"
      className={cn(
        "inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg transition-colors",
        focusRing,
        lightChrome
          ? "text-white/80 hover:text-white hover:bg-white/10"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      <LogOut className="h-4 w-4" />
    </button>
  );

  // Signed-in visitors (admin or credit union) get a shortcut straight
  // back to their own dashboard — this navbar is shared by every public
  // page, so it's the only place a returning credit union manager or
  // admin browsing the public site can jump back in without knowing to
  // type /login or /admin themselves. It's a shortcut, not a login
  // control: it only ever appears once a session already exists.
  const accountLink =
    !isLoaded ? null : !isSignedIn ? (
      <Link
        href="/login"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium border transition-colors",
          focusRing,
          lightChrome
            ? "border-white/40 text-white hover:bg-white/10"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        )}
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Link>
    ) : role === "credit_union" ? (
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">{t("nav_my_dashboard")}</span>
        </Link>
        {signOutButton}
      </div>
    ) : role === "admin" ? (
      <div className="flex items-center gap-1">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary-900 text-white hover:bg-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">{t("nav_admin_dashboard")}</span>
        </Link>
        {signOutButton}
      </div>
    ) : (
      // Signed in with no role yet — a credit union account awaiting
      // admin review (see /signup). /dashboard shows the review-status
      // screen for this case rather than the chapter dashboard.
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">{t("nav_my_dashboard")}</span>
        </Link>
        {signOutButton}
      </div>
    );

  return (
    <>
    <header
      className={cn(
        "print:hidden sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-[240ms]",
        atHeroTop
          ? "bg-transparent border-b border-transparent"
          : lightChrome
          ? "bg-primary-500/92 backdrop-blur-md backdrop-saturate-[1.4] border-b border-white/12"
          : "bg-white border-b border-primary-100 transition-shadow",
        !atHeroTop && isScrolled && "shadow-sm"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className={cn("flex items-center gap-3 min-w-0 rounded-lg", focusRing)}>
          <div className="w-10 h-10 rounded-lg bg-white ring-1 ring-primary-100 flex items-center justify-center overflow-hidden p-1 shrink-0">
            <Image src={logo} alt="CamCCUL logo" className="h-full w-full object-contain" priority />
          </div>
          <div className="min-w-0">
            <span
              className={cn(
                "font-display font-bold text-xl block leading-tight truncate transition-colors",
                lightChrome ? "text-white" : "text-primary-900"
              )}
            >
              CamCCUL
            </span>
            <span
              className={cn(
                "hidden md:block text-xs truncate transition-colors",
                lightChrome ? "text-white/80" : "text-primary-600"
              )}
            >
              {t("nav_tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 shrink-0">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

            if (link.key === "nav_about") {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setIsAboutOpen(true)}
                  onMouseLeave={() => setIsAboutOpen(false)}
                  onFocus={() => setIsAboutOpen(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setIsAboutOpen(false);
                    }
                  }}
                >
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-2 cursor-default",
                      lightChrome
                        ? "text-white hover:text-primary-100"
                        : "text-primary-700 hover:text-primary-600",
                      isActive && !lightChrome && "text-primary-600 font-semibold"
                    )}
                  >
                    {t(link.key)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-56 rounded-lg border border-primary-100 bg-white shadow-lg py-2 transition-opacity duration-150",
                      isAboutOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    )}
                  >
                    {aboutLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsAboutOpen(false)}
                        className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.key === "nav_services") {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  onFocus={() => setIsServicesOpen(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setIsServicesOpen(false);
                    }
                  }}
                >
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-2 cursor-default",
                      lightChrome
                        ? "text-white hover:text-primary-100"
                        : "text-primary-700 hover:text-primary-600",
                      isActive && !lightChrome && "text-primary-600 font-semibold"
                    )}
                  >
                    {t(link.key)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-64 rounded-lg border border-primary-100 bg-white shadow-lg py-2 transition-opacity duration-150",
                      isServicesOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    )}
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {t(service.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors rounded",
                  focusRing,
                  lightChrome
                    ? "text-white hover:text-primary-100"
                    : "text-primary-700 hover:text-primary-600",
                  isActive && !lightChrome && "text-primary-600 font-semibold"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/affiliates"
            className="hidden md:inline-flex items-center bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500"
          >
            {t("nav_find_credit_union")}
          </Link>
          {accountLink}
          {languageToggle}

          <button
            type="button"
            className={cn(
              "md:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-lg transition-colors",
              focusRing,
              lightChrome
                ? "text-white hover:bg-white/10"
                : "text-primary-700 hover:bg-primary-50"
            )}
            aria-label={t("nav_menu_open_aria")}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

    {/*
      Portaled straight to <body>, not rendered inside the header. The
      homepage hero uses `isolate` (to contain its grain layer's
      mix-blend-mode so it doesn't bleed onto content outside the hero) —
      isolate + mix-blend-mode is a known trigger for mobile Safari
      compositing a sibling's fixed-position content *behind* that isolated
      stacking context regardless of z-index. Portaling to body sidesteps it
      entirely: body has no isolation of its own, so ordinary z-index rules
      apply against every ancestor's content, hero included.

      `fixed` (viewport-relative), not `absolute` (relative to the nearest
      positioned ancestor — normally the header, which is `sticky`). In
      principle a stuck sticky header never leaves the viewport's top edge
      so `absolute top-full` should track it, but any ancestor further up
      the tree with a `transform`/`filter`/`contain` creates its own
      containing block and silently breaks that stickiness — the header
      (and an absolutely-positioned menu riding on it) then scrolls away
      with the page instead of staying put. `fixed` sidesteps that question
      too by anchoring to the viewport directly.

      Sized with `top-16`/`bottom-0` insets rather than an explicit height
      (`h-screen`/`100vh`) — those compute against the larger layout
      viewport on mobile (the one that includes the space the address bar
      can occupy), so a menu sized that way can render partly below the
      fold until the page is scrolled once. Insets-from-viewport-edges
      don't have that problem: the element is simply "from 4rem down to
      the bottom of whatever's visible right now."
    */}
    {isMounted && createPortal(
      <>
        <div
          aria-hidden="true"
          onClick={closeMobileMenu}
          className={cn(
            "md:hidden fixed inset-0 z-40 bg-black/30",
            "transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />
        <div
          aria-hidden={!isOpen}
          className={cn(
            "md:hidden fixed top-16 left-0 right-0 bottom-0 z-50 flex flex-col bg-white p-6",
            "overflow-y-auto shadow-xl border-b border-primary-100",
            "transition-all duration-300 ease-in-out",
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label={t("nav_menu_close_aria")}
          className="self-end inline-flex items-center justify-center min-h-11 min-w-11 p-2 -mr-2 mb-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

            if (link.key === "nav_about") {
              return (
                <div key={link.href} className="border-b border-primary-100">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex-1 py-4 text-lg font-medium text-primary-700",
                        isActive && "text-primary-600 font-semibold"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                    <button
                      type="button"
                      aria-label={t("nav_about_toggle_aria")}
                      aria-expanded={isMobileAboutOpen}
                      onClick={() => setIsMobileAboutOpen((prev) => !prev)}
                      className="inline-flex items-center justify-center min-h-11 min-w-11 p-2 text-primary-500"
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          isMobileAboutOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "overflow-hidden pl-4 transition-[max-height] duration-300 ease-in-out",
                      isMobileAboutOpen ? "max-h-[200px]" : "max-h-0"
                    )}
                  >
                    {aboutLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block py-3 text-base text-primary-600 hover:text-primary-500"
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.key === "nav_services") {
              return (
                <div key={link.href} className="border-b border-primary-100">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex-1 py-4 text-lg font-medium text-primary-700",
                        isActive && "text-primary-600 font-semibold"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                    <button
                      type="button"
                      aria-label={t("nav_services_toggle_aria")}
                      aria-expanded={isMobileServicesOpen}
                      onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                      className="inline-flex items-center justify-center min-h-11 min-w-11 p-2 text-primary-500"
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          isMobileServicesOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "overflow-hidden pl-4 transition-[max-height] duration-300 ease-in-out",
                      isMobileServicesOpen ? "max-h-[400px]" : "max-h-0"
                    )}
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={closeMobileMenu}
                        className="block py-3 text-base text-primary-600 hover:text-primary-500"
                      >
                        {t(service.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "py-4 text-lg font-medium text-primary-700 border-b border-primary-100",
                  isActive && "text-primary-600 font-semibold"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/affiliates"
          onClick={closeMobileMenu}
          className="mt-6 flex items-center justify-center w-full bg-primary-500 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-primary-600 transition-colors"
        >
          {t("nav_find_credit_union")}
        </Link>
        </div>
      </>,
      document.body
    )}
    </>
  );
}
