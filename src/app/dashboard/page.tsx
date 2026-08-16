import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// layout.tsx already redirects unauthenticated sessions to /login and admin
// sessions to /admin, so by the time this renders session.user is a
// credit_union session with an affiliateId. profileStatus/profileUpdatedAt
// aren't in the JWT (they change independently of login), so they're read
// fresh here — same "has this chapter actually submitted anything" signal
// (profileUpdatedAt !== null) the admin review queue uses.
export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!affiliateId) {
    return null;
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
    return null;
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
