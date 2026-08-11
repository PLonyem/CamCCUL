"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Building2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems, isAdminNavItemActive } from "./nav-items";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  onNavigate?: () => void;
}

export function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-900 text-white h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-6">
        <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-lg leading-tight truncate">
            CamCCUL
          </p>
          <p className="text-xs text-gray-400 leading-tight">
            Admin Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 mt-8 space-y-1 px-3">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = isAdminNavItemActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 px-4 py-4">
        <p className="text-sm font-medium text-white truncate">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
