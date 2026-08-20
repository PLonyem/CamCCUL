import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface SignupRequestRow {
  id: string;
  creditUnionName: string;
  chapter: string;
  email: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// Backs src/app/admin/users/pending/page.tsx — both the pending queue and
// the "last 10 processed" list come from the same table, split by status,
// so one request covers the whole page instead of two.
export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [pending, recentlyProcessed] = await Promise.all([
    prisma.creditUnionSignupRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.creditUnionSignupRequest.findMany({
      where: { status: { not: "pending" } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  const serialize = (row: (typeof pending)[number]): SignupRequestRow => ({
    id: row.id,
    creditUnionName: row.creditUnionName,
    chapter: row.chapter,
    email: row.email,
    status: row.status,
    rejectionReason: row.rejectionReason,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });

  return NextResponse.json({
    pending: pending.map(serialize),
    recentlyProcessed: recentlyProcessed.map(serialize),
  });
}
