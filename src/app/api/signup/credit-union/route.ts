import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { creditUnionSignupRequestSchema } from "@/lib/validation/credit-union-signup";
import { sendNewSignupRequestToCamCCUL, sendSignupConfirmationToCreditUnion } from "@/lib/email";

// Requires an authenticated (but role-less) Clerk session — proxy.ts's
// default auth.protect() already enforces this since this route isn't in
// isPublicRoute, which is exactly the point: the caller must have already
// completed Clerk account creation (see /signup/page.tsx) before a review
// request can be filed. Email is read from that session, never trusted
// from the request body, so it can't be spoofed to a different address
// than the one actually verified.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No verified email found on this account." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = creditUnionSignupRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { creditUnionName, chapter } = parsed.data;

  // Re-check here too (not just the pre-flight /check route) since a
  // duplicate name could have been claimed in the gap between that check
  // and the Clerk account finishing creation/verification.
  const existingByName = await prisma.creditUnionSignupRequest.findFirst({
    where: {
      creditUnionName: { equals: creditUnionName, mode: "insensitive" },
      email: { not: email },
    },
  });
  if (existingByName) {
    return NextResponse.json(
      {
        error:
          "This credit union name is already in use. If you are the authorized representative, please contact CamCCUL headquarters.",
      },
      { status: 409 }
    );
  }

  // Checked before the upsert so the notification/confirmation emails below
  // only fire once per actual request, not on every retry after a dropped
  // connection — "a new account has been requested" would be wrong to say
  // twice about the same request.
  const alreadyExisted = await prisma.creditUnionSignupRequest.findUnique({
    where: { email },
    select: { id: true },
  });

  // Upsert on email (not create) so retrying after a dropped connection —
  // the Clerk account already exists at this point either way — updates
  // the same pending request instead of failing on the unique constraint.
  const signupRequest = await prisma.creditUnionSignupRequest.upsert({
    where: { email },
    update: { creditUnionName, chapter, status: "pending", rejectionReason: null },
    create: { email, creditUnionName, chapter },
  });

  if (!alreadyExisted) {
    const results = await Promise.allSettled([
      sendNewSignupRequestToCamCCUL({ creditUnionName, chapter, email }),
      sendSignupConfirmationToCreditUnion({ creditUnionName, email }),
    ]);
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Signup notification email failed:", result.reason);
      }
    }
  }

  return NextResponse.json({ success: true, id: signupRequest.id });
}
