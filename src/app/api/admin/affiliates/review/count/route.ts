import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Cheap endpoint for the admin sidebar badge — just the pending-review
// count, not the full chapter list.
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await prisma.affiliate.count({
    where: {
      AND: [
        { OR: [{ profileUpdatedAt: { not: null } }, { documents: { some: {} } }] },
        { OR: [{ profileStatus: "pending" }, { profileStatus: null }] },
      ],
    },
  });

  return NextResponse.json({ pending });
}
