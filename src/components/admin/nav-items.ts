import {
  LayoutDashboard,
  Home,
  Newspaper,
  FolderOpen,
  Building2,
  Upload,
  ClipboardCheck,
  Users,
  UserPlus,
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
  /** Shows a live pending-review count badge next to this item. */
  showReviewBadge?: boolean;
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
      { href: "/admin/news", labelKey: "admin.newsManager", icon: Newspaper },
      { href: "/admin/resources", labelKey: "admin.resourcesManager", icon: FolderOpen },
    ],
  },
  {
    labelKey: "admin.affiliates",
    items: [
      { href: "/admin/affiliates", labelKey: "admin.allAffiliates", icon: Building2 },
      { href: "/admin/affiliates/upload-profile", labelKey: "admin.uploadProfiles", icon: Upload },
      {
        href: "/admin/affiliates/review",
        labelKey: "admin.reviewProfiles",
        icon: ClipboardCheck,
        showReviewBadge: true,
      },
    ],
  },
  {
    labelKey: "admin.users",
    items: [
      { href: "/admin/users", labelKey: "admin.allUsers", icon: Users },
      { href: "/admin/users/create", labelKey: "admin.createAccount", icon: UserPlus },
      { href: "/admin/users/pending", labelKey: "admin.pendingAccountRequests", icon: UserCheck },
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
// match in array order — "/admin/affiliates" is a prefix of
// "/admin/affiliates/review", so a naive first-match would always report
// "All Affiliates" as the page title while on the review page.
export function getAdminPageTitleKey(pathname: string): TranslationKey {
  const bestMatch = adminNavItems
    .filter((item) => isAdminNavItemActive(pathname, item.href))
    .reduce<AdminNavItem | undefined>((best, item) => {
      if (!best || item.href.length > best.href.length) return item;
      return best;
    }, undefined);
  return bestMatch?.labelKey ?? "admin.dashboard";
}
