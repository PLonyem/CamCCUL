import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Cheap endpoint for the admin sidebar badge — just the pending-request
// count, not the full list. Mirrors /api/admin/affiliates/review/count.
export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await prisma.creditUnionSignupRequest.count({ where: { status: "pending" } });

  return NextResponse.json({ pending });
}
