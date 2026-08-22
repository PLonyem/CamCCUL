import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Clock, XCircle, Building2, Eye, Mail as MailIcon, Phone } from "lucide-react";
import { ProfileCompletion, type ProfileField } from "@/components/dashboard/ProfileCompletion";
import { SubmissionTimeline, type SubmissionEntry } from "@/components/dashboard/SubmissionTimeline";
import { AnnouncementsFeed } from "@/components/dashboard/AnnouncementsFeed";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { DeadlineCountdown } from "@/components/dashboard/DeadlineCountdown";

const STEPS = ["Submitted", "Under Review", "Approved"];

function ProgressSteps({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                i <= activeIndex ? "bg-primary-500" : "bg-gray-200"
              )}
            />
            <span
              className={cn(
                "text-[11px] font-medium whitespace-nowrap",
                i <= activeIndex ? "text-primary-700" : "text-gray-400"
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("w-8 h-px", i < activeIndex ? "bg-primary-500" : "bg-gray-200")} />
          )}
        </div>
      ))}
    </div>
  );
}

// The one place in the credit-union portal that calls currentUser() (a real
// Clerk API round trip) instead of reading from sessionClaims — email isn't
// in the JWT by default, and this screen is only ever reached by pending or
// rejected applicants checking their status, not on every navigation like
// the admin shell's now-removed currentUser() call used to be.
async function SignupStatusScreen() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const request = email
    ? await prisma.creditUnionSignupRequest.findUnique({ where: { email } })
    : null;

  if (request?.status === "rejected") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-900 mt-4">
            Account Request Not Approved
          </h1>
          <p className="text-gray-600 mt-2">
            Your request to register <strong>{request.creditUnionName}</strong> was not approved.
          </p>
          {request.rejectionReason && (
            <p className="mt-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-left">
              <span className="font-semibold">Reason: </span>
              {request.rejectionReason}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Please contact CamCCUL headquarters for more information.
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
            Back to Website
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
          <Clock className="h-7 w-7 text-amber-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-900 mt-4">
          Your Account Is Under Review
        </h1>
        <p className="text-gray-600 mt-2">
          {request && (
            <>
              Thanks for registering <strong>{request.creditUnionName}</strong> ({request.chapter}).{" "}
            </>
          )}
          CamCCUL headquarters reviews every new account before granting access to the portal.
          You&apos;ll receive an email as soon as a decision is made — no need to keep checking back.
        </p>

        <ProgressSteps activeIndex={1} />

        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-8")}>
          Back to Website
        </Link>
      </Card>
    </div>
  );
}

// role: "credit_union" with no affiliateId is a real, reachable state, not
// a data error — approving a signup request (POST /api/admin/users/approve)
// deliberately grants the role without linking a specific Affiliate record,
// since picking the right one is a separate admin action that doesn't exist
// yet. Showing nothing here (as this used to) reads exactly like a broken
// dashboard the moment someone gets approved.
function AwaitingAffiliateLinkScreen() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
          <Building2 className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-900 mt-4">
          Almost There
        </h1>
        <p className="text-gray-600 mt-2">
          Your account has been approved, but CamCCUL headquarters hasn&apos;t finished linking it to
          your credit union&apos;s record yet. This is usually quick — check back shortly, or contact
          CamCCUL headquarters if it&apos;s been a while.
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

// layout.tsx already redirects unauthenticated sessions to /login and admin
// sessions to /admin. A role of "credit_union" means an approved chapter
// account with an affiliateId — anything else (no role at all) is a
// pending or rejected signup request, handled by SignupStatusScreen above.
export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role !== "credit_union") {
    return <SignupStatusScreen />;
  }

  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!affiliateId) {
    return <AwaitingAffiliateLinkScreen />;
  }

  const [affiliate, siteSettings] = await Promise.all([
    prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: {
        name: true,
        code: true,
        chapter: true,
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
    return <AwaitingAffiliateLinkScreen />;
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
          {affiliate.chapter && <Badge>{affiliate.chapter}</Badge>}
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
