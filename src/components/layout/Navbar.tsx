"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { regions } from "@/lib/mock-data";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import logo from "../../../public/logo.jpg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Affiliates", href: "/affiliates" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Regulatory Supervision", href: "/services/regulatory-supervision" },
  { label: "Financial Auditing", href: "/services/financial-auditing" },
  { label: "Capacity Building", href: "/services/capacity-building" },
  { label: "Digitalization of Credit Unions", href: "/services/digitalization" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileRegionsOpen, setIsMobileRegionsOpen] = useState(false);
  const [isAffiliatesOpen, setIsAffiliatesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center overflow-hidden p-1 shrink-0">
            <Image src={logo} alt="CamCCUL logo" className="h-full w-full object-contain" priority />
          </div>
          <div>
            <span className="font-display font-bold text-xl text-primary-900 dark:text-white block leading-tight">
              CamCCUL
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Cameroon Cooperative Credit Union League
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            if (link.label === "Services") {
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
                      "flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2 cursor-default",
                      isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-64 rounded-lg border border-gray-200 bg-white shadow-lg py-2",
                      isServicesOpen ? "block" : "hidden"
                    )}
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.label === "Affiliates") {
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
                      "flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2",
                      isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-0 top-full w-56 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 shadow-lg",
                      isAffiliatesOpen ? "block" : "hidden"
                    )}
                  >
                    <Link
                      href="/affiliates"
                      onClick={() => setIsAffiliatesOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800"
                    >
                      All Regions
                    </Link>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                    {regions.map((region) => (
                      <Link
                        key={region}
                        href={`/affiliates?region=${encodeURIComponent(region)}`}
                        onClick={() => setIsAffiliatesOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 capitalize"
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
                  "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors",
                  isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {themeToggle}
          <ComingSoonButton className="hidden md:inline-flex items-center rounded-lg border border-primary-300 dark:border-primary-700 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
            Portal Login
          </ComingSoonButton>
          <ComingSoonButton className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 transition-colors">
            Submit Report
            <ArrowRight className="h-4 w-4" />
          </ComingSoonButton>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <nav className="flex flex-col px-4 py-4 gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            if (link.label === "Services") {
              return (
                <div key={link.href}>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium text-gray-600 dark:text-gray-300 py-2",
                        isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                      )}
                    >
                      {link.label}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle services"
                      aria-expanded={isMobileServicesOpen}
                      onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                      className="p-2 text-gray-500 dark:text-gray-400"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
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
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            if (link.label === "Affiliates") {
              return (
                <div key={link.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2",
                        isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="Toggle regions"
                      aria-expanded={isMobileRegionsOpen}
                      onClick={() => setIsMobileRegionsOpen((prev) => !prev)}
                      className="p-2 text-gray-500 dark:text-gray-400"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
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
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 capitalize"
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
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2",
                  isActive && "text-primary-600 dark:text-primary-400 font-semibold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-200 dark:border-gray-800">
            <ComingSoonButton className="inline-flex items-center justify-center rounded-lg border border-primary-300 dark:border-primary-700 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
              Portal Login
            </ComingSoonButton>
            <ComingSoonButton className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 transition-colors">
              Submit Report
              <ArrowRight className="h-4 w-4" />
            </ComingSoonButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
