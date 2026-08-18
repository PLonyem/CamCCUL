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
  Mail,
  Settings,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shows a live pending-review count badge next to this item. */
  showReviewBadge?: boolean;
}

export interface AdminNavGroup {
  /** Section header label — omitted for standalone top-level items
   * (Dashboard, Messages) that don't belong under a named section. */
  label?: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Website Content",
    items: [
      { href: "/admin/homepage", label: "Homepage Editor", icon: Home },
      { href: "/admin/news", label: "News Manager", icon: Newspaper },
      { href: "/admin/resources", label: "Resources Manager", icon: FolderOpen },
    ],
  },
  {
    label: "Affiliates",
    items: [
      { href: "/admin/affiliates", label: "All Affiliates", icon: Building2 },
      { href: "/admin/affiliates/upload-profile", label: "Upload Profiles", icon: Upload },
      {
        href: "/admin/affiliates/review",
        label: "Review Profiles",
        icon: ClipboardCheck,
        showReviewBadge: true,
      },
    ],
  },
  {
    label: "Users",
    items: [
      { href: "/admin/users", label: "All Users", icon: Users },
      { href: "/admin/users/create", label: "Create Account", icon: UserPlus },
    ],
  },
  {
    items: [{ href: "/admin/messages", label: "Messages", icon: Mail }],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "General Settings", icon: Settings },
      { href: "/admin/settings/notifications", label: "Notification Settings", icon: Bell },
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
export function getAdminPageTitle(pathname: string): string {
  const bestMatch = adminNavItems
    .filter((item) => isAdminNavItemActive(pathname, item.href))
    .reduce<AdminNavItem | undefined>((best, item) => {
      if (!best || item.href.length > best.href.length) return item;
      return best;
    }, undefined);
  return bestMatch?.label ?? "Dashboard";
}
