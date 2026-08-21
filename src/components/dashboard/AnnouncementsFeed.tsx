"use client";

import Link from "next/link";
import { Megaphone, FileText, GraduationCap, Shield, type LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface Announcement {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

interface AnnouncementsFeedProps {
  announcements: Announcement[];
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Announcement: Megaphone,
  Circular: FileText,
  Training: GraduationCap,
  COBAC: Shield,
};

const CATEGORY_BADGE_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  Announcement: "primary",
  Circular: "default",
  Training: "accent",
  COBAC: "warning",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-lg text-gray-900">Announcements from CamCCUL</h2>
        <Link href="/news" className="text-sm text-primary-600 hover:text-primary-700 shrink-0">
          View All →
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="mt-4 text-gray-400 text-sm">No announcements yet.</p>
      ) : (
        <div className="mt-4 -mx-2">
          {announcements.map((item) => {
            const Icon = CATEGORY_ICON[item.category] ?? Megaphone;
            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-primary-100 text-primary-600 rounded-full p-2 h-fit shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <Badge variant={CATEGORY_BADGE_VARIANT[item.category] ?? "default"} className="mb-1">
                    {item.category}
                  </Badge>
                  <p className="font-medium text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.publishedAt)}</p>
                  <p className={cn("text-sm text-gray-600 mt-1", "line-clamp-2")}>{item.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
