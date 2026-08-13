"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
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
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className="inline-flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors"
    >
      <Globe className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase">{language}</span>
    </button>
  );

  return (
    <header
      className={cn(
        "print:hidden sticky top-0 z-40 bg-white border-b border-primary-100 transition-shadow",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-white ring-1 ring-primary-100 flex items-center justify-center overflow-hidden p-1 shrink-0">
            <Image src={logo} alt="CamCCUL logo" className="h-full w-full object-contain" priority />
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-xl text-primary-900 block leading-tight truncate">
              CamCCUL
            </span>
            <span className="hidden md:block text-xs text-primary-600 truncate">
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
                      "flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors py-2 cursor-default",
                      isActive && "text-primary-600 font-semibold"
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
                        className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
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
                      "flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors py-2 cursor-default",
                      isActive && "text-primary-600 font-semibold"
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
                        className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
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
                  "text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors",
                  isActive && "text-primary-600 font-semibold"
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
            className="hidden md:inline-flex items-center bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            {t("nav_find_credit_union")}
          </Link>
          {languageToggle}

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors"
            aria-label={t("nav_menu_open_aria")}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/*
        Anchored to the header (which is `sticky`, so it's a valid containing
        block) and sized to its own content via `top-full` + `max-h`, instead
        of a `fixed inset-0` overlay forced to the full viewport height. The
        old approach relied on `100vh`-style sizing, which on mobile browsers
        is computed against the layout viewport rather than what's actually
        visible above the address bar — so the menu could render partly
        below the fold until the page was scrolled once. Using `100dvh` here
        tracks the real visible viewport, and capping with `max-h` (rather
        than forcing a fixed height) means the menu is exactly as tall as
        its content and only scrolls internally if content is genuinely
        taller than the screen.
      */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          "md:hidden absolute left-0 right-0 top-full z-40 flex flex-col bg-white p-6",
          "max-h-[calc(100dvh-4rem)] overflow-y-auto shadow-xl border-b border-primary-100",
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
    </header>
  );
}
