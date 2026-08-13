import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// A chapter shows up for review once it has either submitted profile
// content (profileUpdatedAt set) or uploaded a document — either path
// through the "Upload Chapter Profiles" tool.
const HAS_SUBMISSION_WHERE: Prisma.AffiliateWhereInput = {
  OR: [{ profileUpdatedAt: { not: null } }, { documents: { some: {} } }],
};

const VALID_STATUSES = ["pending", "approved", "rejected"];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const where: Prisma.AffiliateWhereInput =
    status && VALID_STATUSES.includes(status)
      ? { AND: [HAS_SUBMISSION_WHERE, { profileStatus: status }] }
      : HAS_SUBMISSION_WHERE;

  const [chapters, statusGroups] = await Promise.all([
    prisma.affiliate.findMany({
      where,
      orderBy: { profileUpdatedAt: "desc" },
      select: {
        id: true,
        code: true,
        name: true,
        region: true,
        profileStatus: true,
        profileReviewNote: true,
        profileUpdatedAt: true,
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
        documents: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            status: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.affiliate.groupBy({
      by: ["profileStatus"],
      where: HAS_SUBMISSION_WHERE,
      _count: { _all: true },
    }),
  ]);

  const counts = { pending: 0, approved: 0, rejected: 0 };
  for (const group of statusGroups) {
    const key = (group.profileStatus ?? "pending") as keyof typeof counts;
    if (key in counts) counts[key] += group._count._all;
  }

  return NextResponse.json({
    chapters,
    counts: {
      ...counts,
      total: counts.pending + counts.approved + counts.rejected,
    },
  });
}
