"use client";

import { useEffect, useState } from "react";
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
  const [pendingReviewCount, setPendingReviewCount] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/affiliates/review/count")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { pending: number } | null) => {
        if (!ignore && data) setPendingReviewCount(data.pending);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
    // Re-fetch whenever the admin navigates, so approving/rejecting on the
    // review page updates the badge without a full page reload.
  }, [pathname]);

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
        {adminNavItems.map(({ href, label, icon: Icon, indent, showReviewBadge }) => {
          const isActive = isAdminNavItemActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 py-2.5 rounded-lg font-medium transition-colors",
                indent ? "pl-8 pr-3 text-xs" : "px-3 text-sm",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className={cn("shrink-0", indent ? "h-3.5 w-3.5" : "h-4 w-4")} />
              <span className="flex-1">{label}</span>
              {showReviewBadge && !!pendingReviewCount && (
                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-primary-500 text-white text-[10px] font-semibold">
                  {pendingReviewCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 px-4 py-4">
        <p className="text-sm font-medium text-white truncate">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
