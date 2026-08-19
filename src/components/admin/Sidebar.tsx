"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Building2, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavGroups, isAdminNavItemActive } from "./nav-items";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  onNavigate?: () => void;
}

export function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { t } = useLanguage();
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

      <nav className="flex-1 mt-8 px-3">
        {adminNavGroups.map((group, groupIndex) => (
          <div key={group.labelKey ?? `group-${groupIndex}`}>
            {group.labelKey && (
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-3 mt-6 mb-2">
                {t(group.labelKey)}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(({ href, labelKey, icon: Icon, showReviewBadge }) => {
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
                    <span className="flex-1">{t(labelKey)}</span>
                    {showReviewBadge && !!pendingReviewCount && (
                      <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-primary-500 text-white text-[10px] font-semibold">
                        {pendingReviewCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-800 px-4 py-4">
        <p className="text-sm font-medium text-white truncate">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin.backToWebsite")}
        </Link>
        <button
          onClick={() => signOut({ redirectUrl: "/login" })}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
