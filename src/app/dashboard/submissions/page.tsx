import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { SubmissionTimeline, type SubmissionEntry } from "@/components/dashboard/SubmissionTimeline";

// layout.tsx already gates this whole route group to an authenticated
// session; the affiliateId check below is what keeps a role: "credit_union"
// account without one from querying with `undefined` (see
// dashboard/page.tsx's AwaitingAffiliateLinkScreen for why that state
// exists at all).
export default async function AllSubmissionsPage() {
  const { sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!affiliateId) {
    return null;
  }

  const rows = await prisma.affiliateSubmission.findMany({
    where: { affiliateId, NOT: { status: "superseded" } },
    orderBy: { submittedAt: "desc" },
    select: { id: true, submittedAt: true, status: true, rejectionReason: true },
  });
  const submissions: SubmissionEntry[] = rows.map((row) => ({
    id: row.id,
    submittedAt: row.submittedAt.toISOString(),
    status: row.status as SubmissionEntry["status"],
    rejectionReason: row.rejectionReason,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="font-display text-2xl font-bold text-primary-900 mt-4 mb-6">
        All Submissions
      </h1>

      <SubmissionTimeline submissions={submissions} hasMore={false} />
    </div>
  );
}
