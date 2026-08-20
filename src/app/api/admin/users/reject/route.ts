import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendAccountRejectedEmail } from "@/lib/email";

// No Clerk metadata change on reject — the account simply stays role-less,
// which proxy.ts already treats as "no dashboard access," so there's
// nothing additional to lock down here (unlike approve, which has to
// actively grant access).
export async function PUT(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const reason = typeof body?.reason === "string" && body.reason.trim() ? body.reason.trim() : null;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const signupRequest = await prisma.creditUnionSignupRequest.findUnique({ where: { id } });
  if (!signupRequest) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (signupRequest.status !== "pending") {
    return NextResponse.json({ error: "This request has already been processed." }, { status: 400 });
  }

  const updated = await prisma.creditUnionSignupRequest.update({
    where: { id },
    data: { status: "rejected", rejectionReason: reason },
  });

  try {
    await sendAccountRejectedEmail({
      creditUnionName: signupRequest.creditUnionName,
      email: signupRequest.email,
      reason: reason ?? "No reason provided.",
    });
  } catch (error) {
    console.error("Rejection email failed:", error);
  }

  return NextResponse.json({ success: true, id: updated.id });
}
