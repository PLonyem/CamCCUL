"use client";

import { Fragment, useEffect, useState } from "react";
import {
  ChevronDown,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { regionLabels } from "@/lib/mock-data";
import { RejectDialog } from "./RejectDialog";

interface DocumentSummary {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

interface ReviewChapter {
  id: string;
  code: string;
  name: string;
  region: string;
  profileStatus: string | null;
  profileReviewNote: string | null;
  profileUpdatedAt: string | null;
  yearEstablished: number | null;
  briefHistory: string | null;
  totalMembers: number | null;
  branchCount: number | null;
  memberCreditUnionCount: number | null;
  services: string[];
  chapterPresident: string | null;
  chapterSupervisor: string | null;
  boardSize: number | null;
  staffCount: number | null;
  memberCreditUnions: unknown;
  documents: DocumentSummary[];
}

interface Counts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function statusLabel(status: string | null): string {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending Review";
}

function statusVariant(status: string | null): "success" | "danger" | "warning" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
}

function chapterLabelFor(region: string): string {
  return `${regionLabels[region]?.en ?? region} Chapter`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChapterReviewPage() {
  const [chapters, setChapters] = useState<ReviewChapter[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReviewChapter | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // Flags a reload whenever the effective request (filter + manual
  // refresh) changes — adjusted during render, matching the pattern used
  // by the Affiliates admin list, so the effect below never has to call
  // setIsLoading(true) synchronously on entry.
  const requestKey = `${statusFilter}|${refreshToken}`;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    setIsLoading(true);
  }

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/affiliates/review?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { chapters: ReviewChapter[]; counts: Counts }) => {
        if (ignore) return;
        setChapters(data.chapters);
        setCounts(data.counts);
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [statusFilter, refreshToken]);

  async function updateStatus(
    chapter: ReviewChapter,
    profileStatus: "approved" | "rejected",
    profileReviewNote?: string | null
  ) {
    setActioningId(chapter.id);
    await fetch(`/api/admin/affiliates/${chapter.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileStatus, profileReviewNote: profileReviewNote ?? null }),
    });
    setActioningId(null);
    setRefreshToken((t) => t + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Credit Union Profiles</h1>
        <p className="text-sm text-gray-600 mt-1">
          Approve or reject credit union profile submissions before they appear on the public
          website.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
              statusFilter === tab.value
                ? "bg-primary-500 border-primary-500 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            {tab.label}
            {tab.value && (
              <span className="ml-1.5 opacity-80">
                ({counts[tab.value as keyof Omit<Counts, "total">]})
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          Loading...
        </div>
      ) : chapters.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No credit union profiles found for this filter.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-10 px-4 py-3" />
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Code</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Credit Union Name</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Chapter</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Upload Date</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-right font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chapters.map((chapter) => {
                  const isExpanded = expandedId === chapter.id;
                  const isActioning = actioningId === chapter.id;
                  const document = chapter.documents[0] ?? null;

                  return (
                    <Fragment key={chapter.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : chapter.id)}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{chapter.code}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">{chapter.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="primary">{chapterLabelFor(chapter.region)}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(chapter.profileUpdatedAt)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant(chapter.profileStatus)}>
                            {statusLabel(chapter.profileStatus)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                              disabled={isActioning}
                              onClick={() => updateStatus(chapter, "approved")}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                              disabled={isActioning}
                              onClick={() => setRejectTarget(chapter)}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td />
                          <td colSpan={6} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                  Uploaded Document
                                </p>
                                {document ? (
                                  <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="h-4 w-4 text-primary-500 shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-sm text-gray-900 truncate">{document.fileName}</p>
                                        <p className="text-xs text-gray-500">
                                          {formatFileSize(document.fileSize)} · {formatDate(document.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={`/api/admin/affiliates/${chapter.id}/document`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 shrink-0"
                                    >
                                      View
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No document uploaded — profile submitted via manual entry.
                                  </p>
                                )}

                                {chapter.profileStatus === "rejected" && chapter.profileReviewNote && (
                                  <div className="mt-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                      Rejection Note
                                    </p>
                                    <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3">
                                      {chapter.profileReviewNote}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                  Submitted Profile
                                </p>
                                <dl className="text-sm text-gray-700 space-y-1.5">
                                  {chapter.briefHistory && (
                                    <div>
                                      <dt className="text-xs text-gray-500">History</dt>
                                      <dd className="line-clamp-2">{chapter.briefHistory}</dd>
                                    </div>
                                  )}
                                  {chapter.yearEstablished != null && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Year Founded: </dt>
                                      <dd className="inline">{chapter.yearEstablished}</dd>
                                    </div>
                                  )}
                                  {chapter.chapterPresident && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Board Chairperson: </dt>
                                      <dd className="inline">{chapter.chapterPresident}</dd>
                                    </div>
                                  )}
                                  {chapter.chapterSupervisor && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">General Manager: </dt>
                                      <dd className="inline">{chapter.chapterSupervisor}</dd>
                                    </div>
                                  )}
                                  {chapter.totalMembers != null && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Number of Members: </dt>
                                      <dd className="inline">{chapter.totalMembers}</dd>
                                    </div>
                                  )}
                                  {chapter.branchCount != null && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Number of Branches: </dt>
                                      <dd className="inline">{chapter.branchCount}</dd>
                                    </div>
                                  )}
                                  {chapter.boardSize != null && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Number of Board Members: </dt>
                                      <dd className="inline">{chapter.boardSize}</dd>
                                    </div>
                                  )}
                                  {chapter.staffCount != null && (
                                    <div>
                                      <dt className="text-xs text-gray-500 inline">Number of Staff: </dt>
                                      <dd className="inline">{chapter.staffCount}</dd>
                                    </div>
                                  )}
                                  {chapter.services.length > 0 && (
                                    <div>
                                      <dt className="text-xs text-gray-500 mb-1">Services</dt>
                                      <dd className="flex flex-wrap gap-1.5">
                                        {chapter.services.map((service) => (
                                          <Badge key={service} variant="primary">
                                            {service}
                                          </Badge>
                                        ))}
                                      </dd>
                                    </div>
                                  )}
                                </dl>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RejectDialog
        open={!!rejectTarget}
        creditUnionName={rejectTarget?.name ?? null}
        isSubmitting={actioningId === rejectTarget?.id}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={async (note) => {
          if (!rejectTarget) return;
          await updateStatus(rejectTarget, "rejected", note.trim() || null);
          setRejectTarget(null);
        }}
      />
    </div>
  );
}
