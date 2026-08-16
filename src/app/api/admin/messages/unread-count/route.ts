import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Cheap endpoint for the admin sidebar dot — just the unread count, not the
// full message list.
export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unread = await prisma.contactMessage.count({ where: { isRead: false } });

  return NextResponse.json({ unread });
}
