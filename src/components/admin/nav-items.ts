import {
  LayoutDashboard,
  Newspaper,
  Building2,
  Upload,
  ClipboardCheck,
  FolderOpen,
  Mail,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  indent?: boolean;
  /** Shows a live pending-review count badge next to this item. */
  showReviewBadge?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/affiliates", label: "Affiliates", icon: Building2 },
  { href: "/admin/affiliates/upload-profile", label: "Upload Chapter Profiles", icon: Upload, indent: true },
  {
    href: "/admin/affiliates/review",
    label: "Review Profiles",
    icon: ClipboardCheck,
    indent: true,
    showReviewBadge: true,
  },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function isAdminNavItemActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

// Picks the longest (most specific) matching href rather than the first
// match in array order — "/admin/affiliates" is a prefix of
// "/admin/affiliates/upload-profile", so a naive first-match would always
// report "Affiliates" as the page title while on the upload page.
export function getAdminPageTitle(pathname: string): string {
  const bestMatch = adminNavItems
    .filter((item) => isAdminNavItemActive(pathname, item.href))
    .reduce<AdminNavItem | undefined>((best, item) => {
      if (!best || item.href.length > best.href.length) return item;
      return best;
    }, undefined);
  return bestMatch?.label ?? "Dashboard";
}
