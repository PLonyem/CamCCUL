import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Clock, XCircle, Building2 } from "lucide-react";

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

  const affiliate = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
    select: {
      name: true,
      code: true,
      chapter: true,
      profileStatus: true,
      profileUpdatedAt: true,
    },
  });
  if (!affiliate) {
    return <AwaitingAffiliateLinkScreen />;
  }

  const status = affiliate.profileUpdatedAt !== null ? (affiliate.profileStatus ?? "pending") : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-primary-900">
        Welcome, {affiliate.name}
      </h1>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {affiliate.chapter && <Badge>{affiliate.chapter}</Badge>}
        <Badge>{affiliate.code}</Badge>
      </div>

      <Card className="p-6 mt-6">
        {status === null && (
          <>
            <p className="text-sm text-gray-600">
              You have not submitted your profile yet.
            </p>
            <Link href="/dashboard/profile" className={cn(buttonVariants(), "mt-4")}>
              Complete Your Profile
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <Badge className="bg-amber-100 text-amber-700">Under Review</Badge>
            <p className="text-sm text-gray-600 mt-3">
              Your profile is being reviewed. You will receive an email when
              it is approved.
            </p>
            <Link
              href="/dashboard/profile"
              className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
            >
              Update Profile
            </Link>
          </>
        )}

        {status === "approved" && (
          <>
            <Badge variant="success">Approved</Badge>
            <p className="text-sm text-gray-600 mt-3">
              Your profile is live on the website.
            </p>
            <Link
              href="/dashboard/profile"
              className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
            >
              Update Profile
            </Link>
          </>
        )}

        {status === "rejected" && (
          <>
            <Badge variant="danger">Rejected</Badge>
            <p className="text-sm text-gray-600 mt-3">
              Please update and resubmit your profile.
            </p>
            <Link href="/dashboard/profile" className={cn(buttonVariants(), "mt-4")}>
              Update Profile
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
