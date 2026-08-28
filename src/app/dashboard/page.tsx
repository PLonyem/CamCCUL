import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Building2, Eye, Mail as MailIcon, Phone } from "lucide-react";
import { ProfileCompletion, type ProfileField } from "@/components/dashboard/ProfileCompletion";
import { SubmissionTimeline, type SubmissionEntry } from "@/components/dashboard/SubmissionTimeline";
import { AnnouncementsFeed } from "@/components/dashboard/AnnouncementsFeed";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { DeadlineCountdown } from "@/components/dashboard/DeadlineCountdown";

function AccountConfigurationScreen() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
          <Building2 className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-900 mt-4">
          Account Setup Incomplete
        </h1>
        <p className="text-gray-600 mt-2">
          This portal account is not linked to a credit union record. Contact your chapter supervisor
          or CamCCUL headquarters so the account can be corrected.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Back to Website
        </Link>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (status === "approved") return <Badge variant="success">Approved</Badge>;
  if (status === "rejected") return <Badge variant="danger">Rejected</Badge>;
  if (status === "pending") return <Badge className="bg-amber-100 text-amber-700">Under Review</Badge>;
  return <Badge>Not Submitted</Badge>;
}

// layout.tsx admits only active credit-union accounts. Every account created
// by the admin flow is linked to its Affiliate record before credentials are
// delivered.
export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!affiliateId) {
    return <AccountConfigurationScreen />;
  }

  const [affiliate, siteSettings] = await Promise.all([
    prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: {
        name: true,
        code: true,
        chapter: { select: { name: true } },
        profileStatus: true,
        profileUpdatedAt: true,
        yearEstablished: true,
        city: true,
        address: true,
        phone: true,
        email: true,
        briefHistory: true,
        totalMembers: true,
        branchCount: true,
        services: true,
        chapterPresident: true,
        chapterSupervisor: true,
        boardSize: true,
        staffCount: true,
      },
    }),
    // Single source of truth for CamCCUL's own contact details (Need Help
    // section below) — never hardcoded here, since this app has a standing
    // history of conflicting phone/email values scattered across files.
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);
  if (!affiliate) {
    return <AccountConfigurationScreen />;
  }

  const status = affiliate.profileUpdatedAt !== null ? (affiliate.profileStatus ?? "pending") : null;

  // "superseded" rows (a resubmission before a prior one was ever decided)
  // are deliberately excluded — nothing meaningful to show about those.
  // Fetches one extra row (6, not 5) purely to know whether "View All"
  // should appear, without a separate count query.
  const submissionRows = await prisma.affiliateSubmission.findMany({
    where: { affiliateId, NOT: { status: "superseded" } },
    orderBy: { submittedAt: "desc" },
    take: 6,
    select: { id: true, submittedAt: true, status: true, rejectionReason: true },
  });
  const submissions: SubmissionEntry[] = submissionRows.slice(0, 5).map((row) => ({
    id: row.id,
    submittedAt: row.submittedAt.toISOString(),
    status: row.status as SubmissionEntry["status"],
    rejectionReason: row.rejectionReason,
  }));

  // "Filled" means present — 0 is a legitimate real value for a count
  // field, so only null/undefined/empty-string/empty-array count as
  // missing. Labels and anchorId both match /dashboard/profile's field
  // labels and input ids exactly, since a mismatch here would silently
  // break the "click a missing field to jump to it" links.
  const profileFields: ProfileField[] = [
    { key: "creditUnionName", label: "Credit Union Name", anchorId: "creditUnionName", filled: true },
    { key: "yearEstablished", label: "Year Founded", anchorId: "yearFounded", filled: affiliate.yearEstablished != null },
    { key: "city", label: "City", anchorId: "city", filled: !!affiliate.city },
    { key: "address", label: "Address", anchorId: "address", filled: !!affiliate.address },
    { key: "phone", label: "Phone", anchorId: "phone", filled: !!affiliate.phone },
    { key: "email", label: "Email", anchorId: "email", filled: !!affiliate.email },
    { key: "briefHistory", label: "Brief History", anchorId: "briefHistory", filled: !!affiliate.briefHistory },
    { key: "totalMembers", label: "Number of Members", anchorId: "totalMembers", filled: affiliate.totalMembers != null },
    { key: "branchCount", label: "Number of Branches", anchorId: "branchCount", filled: affiliate.branchCount != null },
    { key: "services", label: "Services Offered", anchorId: "servicesOffered", filled: affiliate.services.length > 0 },
    { key: "chapterPresident", label: "Board Chairperson", anchorId: "boardChairperson", filled: !!affiliate.chapterPresident },
    { key: "chapterSupervisor", label: "General Manager", anchorId: "generalManager", filled: !!affiliate.chapterSupervisor },
    { key: "boardSize", label: "Number of Board Members", anchorId: "boardMemberCount", filled: affiliate.boardSize != null },
    { key: "staffCount", label: "Number of Staff", anchorId: "staffCount", filled: affiliate.staffCount != null },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 1. WELCOME HEADER */}
      <div>
        <h1 className="font-display text-2xl font-bold text-primary-900">
          Welcome, {affiliate.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {affiliate.chapter && <Badge>{affiliate.chapter.name}</Badge>}
          <Badge>{affiliate.code}</Badge>
        </div>
      </div>

      {/* 2. PROFILE COMPLETION */}
      <div id="profile-completion" className="scroll-mt-28">
        <ProfileCompletion fields={profileFields} />
      </div>

      {/* 3. QUICK STATS */}
      <div id="quick-stats" className="scroll-mt-28">
        <QuickStats
          isApproved={status === "approved"}
          totalMembers={affiliate.totalMembers}
          branchCount={affiliate.branchCount}
          yearEstablished={affiliate.yearEstablished}
          servicesCount={affiliate.services.length}
        />
      </div>

      {/* 4. QUICK ACTIONS */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-lg text-gray-900">Quick Actions</h2>
          <StatusBadge status={status} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/profile" className={buttonVariants()}>
            {status === null ? "Complete Profile" : "Update Profile"}
          </Link>
          <Link href={`/affiliates/${affiliate.code}`} className={buttonVariants({ variant: "outline" })}>
            <Eye className="h-4 w-4" />
            Preview Profile
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
            Contact CamCCUL
          </Link>
        </div>
      </Card>

      {/* 5. DEADLINE COUNTDOWN */}
      <div id="deadline-countdown" className="scroll-mt-28">
        <DeadlineCountdown />
      </div>

      {/* 6. ANNOUNCEMENTS FEED */}
      <div id="announcements" className="scroll-mt-28">
        <AnnouncementsFeed />
      </div>

      {/* 7. SUBMISSION HISTORY */}
      <div id="submission-history" className="scroll-mt-28">
        <SubmissionTimeline submissions={submissions} hasMore={submissionRows.length > 5} />
      </div>

      {/* 8. NEED HELP */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-3">Need Help?</h2>
        <div className="space-y-2 text-sm text-gray-600">
          {siteSettings?.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              {siteSettings.phone}
            </p>
          )}
          {siteSettings?.email && (
            <p className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-gray-400 shrink-0" />
              {siteSettings.email}
            </p>
          )}
        </div>
        <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
          Contact Us
        </Link>
      </Card>
    </div>
  );
}
