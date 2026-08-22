import {
  LayoutDashboard,
  Home,
  Newspaper,
  FolderOpen,
  Megaphone,
  Building2,
  ClipboardCheck,
  Users,
  UserCheck,
  Mail,
  Settings,
  Bell,
  type LucideIcon,
} from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

export interface AdminNavItem {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  /** Shows a live count badge next to this item, sourced from the
   * matching endpoint in Sidebar.tsx. Each badge kind has its own count
   * and color — "affiliateReview" (blue) vs. "pendingAccounts" (red). */
  badge?: "affiliateReview" | "pendingAccounts";
}

export interface AdminNavGroup {
  /** Section header label key — omitted for standalone top-level items
   * (Dashboard, Messages) that don't belong under a named section. */
  labelKey?: TranslationKey;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    items: [{ href: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard }],
  },
  {
    labelKey: "admin.websiteContent",
    items: [
      { href: "/admin/homepage", labelKey: "admin.homepageEditor", icon: Home },
      { href: "/admin/announcements", labelKey: "admin.announcementsManager", icon: Megaphone },
      { href: "/admin/news", labelKey: "admin.newsManager", icon: Newspaper },
      { href: "/admin/resources", labelKey: "admin.resourcesManager", icon: FolderOpen },
    ],
  },
  {
    labelKey: "admin.affiliates",
    items: [
      { href: "/admin/affiliates", labelKey: "admin.allAffiliates", icon: Building2 },
      {
        href: "/admin/affiliates/review",
        labelKey: "admin.reviewProfiles",
        icon: ClipboardCheck,
        badge: "affiliateReview",
      },
    ],
  },
  {
    labelKey: "admin.users",
    items: [
      { href: "/admin/users", labelKey: "admin.allUsers", icon: Users },
      {
        href: "/admin/users/pending",
        labelKey: "admin.pendingApprovals",
        icon: UserCheck,
        badge: "pendingAccounts",
      },
    ],
  },
  {
    items: [{ href: "/admin/messages", labelKey: "admin.messages", icon: Mail }],
  },
  {
    labelKey: "admin.settings",
    items: [
      { href: "/admin/settings", labelKey: "admin.generalSettings", icon: Settings },
      { href: "/admin/settings/notifications", labelKey: "admin.notificationSettings", icon: Bell },
    ],
  },
];

// Flattened view for callers that don't care about section grouping.
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items);

export function isAdminNavItemActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

// Picks the longest (most specific) matching href rather than the first
// match in array order — "/admin/users" is a prefix of "/admin/users/create"
// and "/admin/users/pending", which are siblings, not children, of "All
// Users". Without picking a single winner here, every nav item sharing a
// URL prefix with the current page would independently test "active" and
// all of them would highlight at once instead of just the one you're on.
function bestMatchingNavItem(pathname: string): AdminNavItem | undefined {
  return adminNavItems
    .filter((item) => isAdminNavItemActive(pathname, item.href))
    .reduce<AdminNavItem | undefined>((best, item) => {
      if (!best || item.href.length > best.href.length) return item;
      return best;
    }, undefined);
}

export function getAdminPageTitleKey(pathname: string): TranslationKey {
  return bestMatchingNavItem(pathname)?.labelKey ?? "admin.dashboard";
}

// The single nav item Sidebar.tsx should render as highlighted for the
// current pathname — see bestMatchingNavItem above for why this can't just
// be "every item whose href is a prefix of pathname".
export function getActiveAdminNavHref(pathname: string): string | undefined {
  return bestMatchingNavItem(pathname)?.href;
}
