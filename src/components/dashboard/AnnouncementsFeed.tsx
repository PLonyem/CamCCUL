"use client";

import { useEffect, useState } from "react";
import { Megaphone, FileText, GraduationCap, Shield, CalendarDays, type LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  publishedAt: string | null;
}

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Announcement: Megaphone,
  Circular: FileText,
  Training: GraduationCap,
  COBAC: Shield,
  Event: CalendarDays,
};

const CATEGORY_BADGE_VARIANT: Record<string, NonNullable<BadgeProps["variant"]>> = {
  Announcement: "default",
  Circular: "primary",
  Training: "accent",
  COBAC: "warning",
  Event: "success",
};

// Matches the admin Announcements Manager's own priority dot colors, so
// severity reads the same way in both places.
const PRIORITY_DOT_COLOR: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
  low: "bg-gray-400",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data: Announcement[]) => {
        if (ignore) return;
        setAnnouncements(data);
        setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-semibold text-lg text-gray-900">Announcements from CamCCUL</h2>

      {isLoading ? (
        <p className="mt-4 text-gray-400 text-sm">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="mt-4 text-gray-400 text-sm">No announcements from CamCCUL at this time.</p>
      ) : (
        <div className="mt-4 -mx-2">
          {announcements.map((item) => {
            const Icon = CATEGORY_ICON[item.category] ?? Megaphone;
            return (
              <div key={item.id} className="flex gap-3 p-2 rounded-lg">
                <div className="bg-primary-100 text-primary-600 rounded-full p-2 h-fit shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        PRIORITY_DOT_COLOR[item.priority] ?? "bg-gray-400"
                      )}
                      aria-hidden="true"
                    />
                    <Badge variant={CATEGORY_BADGE_VARIANT[item.category] ?? "default"}>
                      {item.category}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.publishedAt)}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
