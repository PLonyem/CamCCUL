import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendAccountApprovedEmail } from "@/lib/email";

// Approving a signup request has to do two things, not one: flip the
// review-queue row to "approved" (cosmetic — nothing else reads this
// status), and grant the applicant's existing Clerk account
// role: "credit_union" in publicMetadata — that role is never set
// automatically at signup, and dashboard/page.tsx uses it to decide
// between the review-status screen and the real chapter dashboard.
// Skipping the metadata update would leave the account showing "pending"
// forever despite an "approved" email telling them to sign in.
//
// Deliberately does not set affiliateId here — matching this request to a
// specific Affiliate record is a separate, more involved action (picking
// which of that chapter's Affiliate rows this is) that this simple
// approve/reject flow doesn't cover. affiliateId stays null until that
// exists, which is why dashboard/page.tsx has its own fallback for
// role: "credit_union" + no affiliateId yet, instead of assuming approval
// alone means a fully-linked account.
export async function PUT(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
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

  const clerk = await clerkClient();
  const { data: matches } = await clerk.users.getUserList({ emailAddress: [signupRequest.email] });
  const clerkUser = matches[0];
  if (!clerkUser) {
    return NextResponse.json(
      { error: "Could not find the account matching this request's email." },
      { status: 500 }
    );
  }

  await clerk.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: { role: "credit_union", chapter: signupRequest.chapter },
  });

  const updated = await prisma.creditUnionSignupRequest.update({
    where: { id },
    data: { status: "approved", rejectionReason: null },
  });

  try {
    await sendAccountApprovedEmail({
      creditUnionName: signupRequest.creditUnionName,
      email: signupRequest.email,
    });
  } catch (error) {
    console.error("Approval email failed:", error);
  }

  return NextResponse.json({ success: true, id: updated.id });
}
