"use client";

import Link from "next/link";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { t } = useLanguage();
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/admin" className="flex min-w-0 items-center gap-3 rounded-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              <Image
                src="/logo.jpg"
                alt="CamCCUL logo"
                width={74}
                height={90}
                priority
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="font-display block text-xl font-bold text-primary-900">CamCCUL</span>
              <span className="block truncate text-xs text-gray-500">
                {t("nav_admin_dashboard")}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
              {initial}
            </div>
            <span className="hidden max-w-48 truncate text-sm font-medium text-gray-700 sm:block">
              {displayName}
            </span>
          </div>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/login" })}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav_sign_out")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
