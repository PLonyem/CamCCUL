"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { getAdminPageTitle } from "./nav-items";

interface AdminNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  onMenuClick: () => void;
}

export function AdminNavbar({ user, onMenuClick }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const title = getAdminPageTitle(pathname);
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((open) => !open)}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {initial}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user.name}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isUserMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
