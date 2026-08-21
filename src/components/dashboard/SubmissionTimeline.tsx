"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface SubmissionEntry {
  id: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "draft";
  rejectionReason: string | null;
}

interface SubmissionTimelineProps {
  submissions: SubmissionEntry[];
  /** True if there are more submissions beyond what's in `submissions`
   * (the caller already limits to the latest 5) — shows "View All". */
  hasMore: boolean;
}

const DOT_COLOR: Record<SubmissionEntry["status"], string> = {
  approved: "bg-green-500",
  pending: "bg-amber-500",
  rejected: "bg-red-500",
  draft: "bg-gray-400",
};

function StatusBadge({ status }: { status: SubmissionEntry["status"] }) {
  if (status === "approved") return <Badge variant="success">Approved</Badge>;
  if (status === "rejected") return <Badge variant="danger">Rejected</Badge>;
  if (status === "draft") return <Badge>Draft</Badge>;
  return <Badge className="bg-amber-100 text-amber-700">Under Review</Badge>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function SubmissionTimeline({ submissions, hasMore }: SubmissionTimelineProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-semibold text-lg text-gray-900">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="mt-6 text-center py-6">
          <FileText className="h-8 w-8 text-gray-300 mx-auto" />
          <p className="mt-3 text-gray-400 font-medium">No submissions yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Once you submit your profile, the history will appear here.
          </p>
          <Link href="/dashboard/profile" className={cn(buttonVariants(), "mt-4")}>
            Complete Profile
          </Link>
        </div>
      ) : (
        <>
          <ol className="mt-5 relative">
            {submissions.map((entry, index) => (
              <li key={entry.id} className="relative pl-8 pb-6 last:pb-0">
                {index < submissions.length - 1 && (
                  <span className="absolute left-[7px] top-3 bottom-0 w-px bg-gray-200" aria-hidden="true" />
                )}
                <span
                  className={cn(
                    "absolute left-0 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white",
                    DOT_COLOR[entry.status]
                  )}
                  aria-hidden="true"
                />
                <p className="text-sm text-gray-500">{formatDate(entry.submittedAt)}</p>
                <div className="mt-1">
                  <StatusBadge status={entry.status} />
                </div>
                {entry.status === "rejected" && entry.rejectionReason && (
                  <p className="text-sm text-red-600 italic mt-1.5">{entry.rejectionReason}</p>
                )}
              </li>
            ))}
          </ol>

          {hasMore && (
            <Link
              href="/dashboard/submissions"
              className="inline-block mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All →
            </Link>
          )}
        </>
      )}
    </div>
  );
}
