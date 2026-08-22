import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { History as HistoryIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/Button";

// Keys match CreditUnionProfileValues (src/lib/validation/credit-union-
// profile.ts) exactly — this is the full shape stored in each submission's
// fieldSnapshot, and the label a chapter sees on the profile form itself.
const PROFILE_FIELD_LABELS: Record<string, string> = {
  creditUnionName: "Credit Union Name",
  code: "Code",
  chapter: "Chapter",
  yearFounded: "Year Founded",
  city: "City",
  address: "Address",
  phone: "Phone",
  email: "Email",
  website: "Website",
  briefHistory: "Brief History",
  totalMembers: "Number of Members",
  branchCount: "Number of Branches",
  servicesOffered: "Services Offered",
  servicesOfferedOther: "Other Service",
  boardChairperson: "Board Chairperson",
  generalManager: "General Manager",
  boardMemberCount: "Number of Board Members",
  staffCount: "Number of Staff",
};

interface FieldChange {
  label: string;
  from: string;
  to: string;
}

interface HistoryEntry {
  id: string;
  submittedAt: Date;
  status: string;
  // null = nothing to diff (first-ever submission, or a snapshot is
  // missing on this or the prior row because it predates fieldSnapshot).
  changes: FieldChange[] | null;
  note: string | null;
}

function isSnapshotObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "(empty)";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "(empty)";
  const str = String(value);
  return str.length > 80 ? `${str.slice(0, 80)}…` : str;
}

function diffSnapshots(
  prev: Record<string, unknown>,
  next: Record<string, unknown>
): FieldChange[] {
  const changes: FieldChange[] = [];
  for (const [key, label] of Object.entries(PROFILE_FIELD_LABELS)) {
    const prevValue = prev[key];
    const nextValue = next[key];
    if (JSON.stringify(prevValue ?? null) !== JSON.stringify(nextValue ?? null)) {
      changes.push({ label, from: formatValue(prevValue), to: formatValue(nextValue) });
    }
  }
  return changes;
}

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

interface SubmissionRow {
  id: string;
  submittedAt: Date;
  status: string;
  fieldSnapshot: unknown;
}

// Pure data transform kept outside the component body (not just inline in
// the render path) so building it up with a running "last real snapshot"
// pointer is a plain loop over already-fetched rows, nothing tied to render.
function buildHistoryEntries(rows: SubmissionRow[]): HistoryEntry[] {
  let lastSnapshot: Record<string, unknown> | null = null;
  const entries: HistoryEntry[] = rows.map((row, index) => {
    const snapshot = isSnapshotObject(row.fieldSnapshot) ? row.fieldSnapshot : null;
    let changes: FieldChange[] | null = null;
    let note: string | null = null;

    if (index === 0) {
      note = "Initial submission";
    } else if (!snapshot || !lastSnapshot) {
      note = "Change details weren't tracked for this submission";
    } else {
      changes = diffSnapshots(lastSnapshot, snapshot);
      if (changes.length === 0) note = "No field changes detected";
    }

    if (snapshot) lastSnapshot = snapshot;

    return { id: row.id, submittedAt: row.submittedAt, status: row.status, changes, note };
  });

  // Newest first, matching Submission History's convention.
  return entries.reverse();
}

export default async function ProfileHistoryPage() {
  const { userId, sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!userId || sessionClaims?.metadata?.role !== "credit_union" || !affiliateId) {
    redirect("/dashboard");
  }

  // Every submission, including superseded ones — each represents a real
  // edit a chapter made, unlike the Submission History timeline (which
  // excludes superseded rows because it's about review status, not edits).
  const rows = await prisma.affiliateSubmission.findMany({
    where: { affiliateId },
    orderBy: { submittedAt: "asc" },
    select: { id: true, submittedAt: true, status: true, fieldSnapshot: true },
  });

  const entries = buildHistoryEntries(rows);

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-primary-900">Edit History</h1>
        <Link href="/dashboard/profile" className={buttonVariants({ variant: "outline" })}>
          Back to Profile
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
        {entries.length === 0 ? (
          <div className="text-center py-6">
            <HistoryIcon className="h-8 w-8 text-gray-300 mx-auto" />
            <p className="mt-3 text-gray-400 font-medium">No changes yet.</p>
          </div>
        ) : (
          <ol className="relative">
            {entries.map((entry, index) => (
              <li key={entry.id} className="relative pl-8 pb-6 last:pb-0">
                {index < entries.length - 1 && (
                  <span
                    className="absolute left-[7px] top-3 bottom-0 w-px bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-primary-500 ring-4 ring-white"
                  aria-hidden="true"
                />
                <p className="text-sm text-gray-500">{formatDate(entry.submittedAt)}</p>

                {entry.changes && entry.changes.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {entry.changes.map((change) => (
                      <li key={change.label} className="text-sm">
                        <span className="font-medium text-gray-900">{change.label}: </span>
                        <span className="text-gray-500">{change.from}</span>
                        <span className="text-gray-400"> → </span>
                        <span className="text-gray-900">{change.to}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-1">{entry.note}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
