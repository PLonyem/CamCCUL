import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  ChapterProfileClient,
  type ChapterDetail,
  type MemberCreditUnionEntry,
} from "@/app/(site)/affiliates/[code]/ChapterProfileClient";

// Mirrors affiliates/[code]/page.tsx's own defensive parse of the loosely-
// typed memberCreditUnions Json column — duplicated rather than imported
// since that file is a route module (Next restricts extra named exports
// from page.tsx files to generateMetadata/generateStaticParams/etc.).
function parseMemberCreditUnions(value: unknown): MemberCreditUnionEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is MemberCreditUnionEntry =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as Record<string, unknown>).name === "string" &&
      typeof (entry as Record<string, unknown>).code === "string"
  );
}

export default async function ProfilePreviewPage() {
  const { userId, sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!userId || sessionClaims?.metadata?.role !== "credit_union" || !affiliateId) {
    redirect("/dashboard");
  }

  const affiliate = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
    select: {
      id: true,
      code: true,
      name: true,
      region: true,
      city: true,
      address: true,
      phone: true,
      email: true,
      yearEstablished: true,
      briefHistory: true,
      totalMembers: true,
      branchCount: true,
      memberCreditUnionCount: true,
      services: true,
      chapterPresident: true,
      chapterSupervisor: true,
      boardSize: true,
      staffCount: true,
      memberCreditUnions: true,
      profileStatus: true,
      profileUpdatedAt: true,
    },
  });

  // profileUpdatedAt is null exactly when this chapter has never submitted
  // the profile form — same signal dashboard/page.tsx uses to distinguish
  // "not submitted" from "submitted, still pending".
  if (!affiliate || affiliate.profileUpdatedAt === null) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <FileQuestion className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No profile submitted yet.</p>
        <Link href="/dashboard/profile" className={cn(buttonVariants(), "mt-6")}>
          Edit Profile
        </Link>
      </div>
    );
  }

  const detail: ChapterDetail = {
    ...affiliate,
    memberCreditUnions: parseMemberCreditUnions(affiliate.memberCreditUnions),
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="font-display text-xl font-bold text-primary-900">Preview Profile</h1>
        <Link href="/dashboard/profile" className={buttonVariants({ variant: "outline" })}>
          Edit Profile
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <ChapterProfileClient affiliate={detail} requestedCode={affiliate.code} previewMode />
      </div>
    </div>
  );
}
