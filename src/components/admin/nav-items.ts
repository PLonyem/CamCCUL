import {
  LayoutDashboard,
  Newspaper,
  Building2,
  FolderOpen,
  Mail,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/affiliates", label: "Affiliates", icon: Building2 },
  { href: "/admin/resources", label: "Resources", icon: FolderOpen },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function isAdminNavItemActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function getAdminPageTitle(pathname: string): string {
  const match = adminNavItems.find((item) =>
    isAdminNavItemActive(pathname, item.href)
  );
  return match?.label ?? "Dashboard";
}
