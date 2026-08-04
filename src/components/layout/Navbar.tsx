"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { regions } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "../../../public/logo.jpg";

const navLinks: { key: TranslationKey; href: string }[] = [
  { key: "nav_home", href: "/" },
  { key: "nav_about", href: "/about" },
  { key: "nav_services", href: "/services" },
  { key: "nav_affiliates", href: "/affiliates" },
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

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileRegionsOpen, setIsMobileRegionsOpen] = useState(false);
  const [isAffiliatesOpen, setIsAffiliatesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

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
      className="inline-flex items-center justify-center gap-1 min-h-11 min-w-11 px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <Globe className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase">{language}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-white ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center overflow-hidden p-1 shrink-0">
            <Image src={logo} alt="CamCCUL logo" className="h-full w-full object-contain" priority />
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-xl text-primary-900 dark:text-white block leading-tight truncate">
              CamCCUL
            </span>
            <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400 truncate">
              {t("nav_tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 shrink-0">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

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
                      "flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors py-2 cursor-default",
                      isActive && "text-primary-600 dark:text-white font-semibold"
                    )}
                  >
                    {t(link.key)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-2 transition-opacity duration-150",
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
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {t(service.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.key === "nav_affiliates") {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setIsAffiliatesOpen(true)}
                  onMouseLeave={() => setIsAffiliatesOpen(false)}
                  onFocus={() => setIsAffiliatesOpen(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setIsAffiliatesOpen(false);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors py-2",
                      isActive && "text-primary-600 dark:text-white font-semibold"
                    )}
                  >
                    {t(link.key)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-lg transition-opacity duration-150",
                      isAffiliatesOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    )}
                  >
                    <Link
                      href="/affiliates"
                      onClick={() => setIsAffiliatesOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-primary-700 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                    >
                      {t("nav_affiliates_all_regions")}
                    </Link>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                    {regions.map((region) => (
                      <Link
                        key={region}
                        href={`/affiliates?region=${encodeURIComponent(region)}`}
                        onClick={() => setIsAffiliatesOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-white rounded-md capitalize"
                      >
                        {region.toLowerCase()}
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
                  "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white transition-colors",
                  isActive && "text-primary-600 dark:text-white font-semibold"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {languageToggle}
          <ThemeToggle aria-label={t("nav_theme_aria")} />

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={t("nav_menu_open_aria")}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isOpen}
        className={cn(
          "md:hidden fixed inset-0 top-16 z-40 flex flex-col bg-white dark:bg-gray-900 p-6 overflow-y-auto transition-all duration-300 ease-in-out",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label={t("nav_menu_close_aria")}
          className="self-end inline-flex items-center justify-center min-h-11 min-w-11 p-2 -mr-2 mb-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);

            if (link.key === "nav_services") {
              return (
                <div key={link.href} className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex-1 py-4 text-lg font-medium text-gray-700 dark:text-gray-200",
                        isActive && "text-primary-600 dark:text-white font-semibold"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                    <button
                      type="button"
                      aria-label={t("nav_services_toggle_aria")}
                      aria-expanded={isMobileServicesOpen}
                      onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                      className="inline-flex items-center justify-center min-h-11 min-w-11 p-2 text-gray-500 dark:text-gray-400"
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
                        className="block py-3 text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white"
                      >
                        {t(service.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.key === "nav_affiliates") {
              return (
                <div key={link.href} className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex-1 py-4 text-lg font-medium text-gray-700 dark:text-gray-200",
                        isActive && "text-primary-600 dark:text-white font-semibold"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                    <button
                      type="button"
                      aria-label={t("nav_regions_toggle_aria")}
                      aria-expanded={isMobileRegionsOpen}
                      onClick={() => setIsMobileRegionsOpen((prev) => !prev)}
                      className="inline-flex items-center justify-center min-h-11 min-w-11 p-2 text-gray-500 dark:text-gray-400"
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          isMobileRegionsOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "overflow-hidden pl-4 transition-[max-height] duration-300 ease-in-out",
                      isMobileRegionsOpen ? "max-h-[600px]" : "max-h-0"
                    )}
                  >
                    {regions.map((region) => (
                      <Link
                        key={region}
                        href={`/affiliates?region=${encodeURIComponent(region)}`}
                        onClick={closeMobileMenu}
                        className="block py-3 text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white capitalize"
                      >
                        {region.toLowerCase()}
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
                  "py-4 text-lg font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800",
                  isActive && "text-primary-600 dark:text-white font-semibold"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
