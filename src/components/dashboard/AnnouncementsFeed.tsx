"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

// The collapsed preview and the expanded body are two separately-toggled
// grid rows (each its own 0fr <-> 1fr transition) rather than one block
// whose content is swapped — line-clamp itself can't be animated (it isn't
// an interpolatable CSS property), but each row's *presence* can, so a
// simultaneous fade-out-preview / fade-in-full-content reads as one smooth
// expand instead of a hard cut.
function AnnouncementCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: Announcement;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors duration-300",
        isExpanded ? "bg-primary-50/50 border-primary-200" : "bg-white border-gray-200"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn("h-2 w-2 rounded-full shrink-0", PRIORITY_DOT_COLOR[item.priority] ?? "bg-gray-400")}
          aria-hidden="true"
        />
        <p className="font-medium text-sm text-gray-900">{item.title}</p>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          isExpanded ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-gray-600 mt-1">{item.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={CATEGORY_BADGE_VARIANT[item.category] ?? "default"}>{item.category}</Badge>
            <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-2 text-sm text-primary-600 font-medium inline-flex items-center gap-1"
      >
        {isExpanded ? (
          <>
            Show Less
            <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Read More
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

export function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  function toggleExpanded(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-semibold text-lg text-gray-900">Announcements from CamCCUL</h2>

      {isLoading ? (
        <p className="mt-4 text-gray-400 text-sm">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="mt-4 text-gray-400 text-sm">No announcements from CamCCUL at this time.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleExpanded(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
