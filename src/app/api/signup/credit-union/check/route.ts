import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public, unauthenticated pre-check run before the Clerk account is
// created. Clerk already rejects a duplicate email in real time via
// signUp.create() — this route only needs to cover the one thing Clerk
// can't check: the free-text credit union name. Doing this before account
// creation (rather than only at final submission) avoids a dead-end where
// a Clerk account already exists but the request can never be filed under
// a name someone else has claimed.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const creditUnionName = typeof body?.creditUnionName === "string" ? body.creditUnionName.trim() : "";

  if (creditUnionName.length < 3) {
    return NextResponse.json({ error: "Credit union name must be at least 3 characters." }, { status: 400 });
  }

  const existing = await prisma.creditUnionSignupRequest.findFirst({
    where: { creditUnionName: { equals: creditUnionName, mode: "insensitive" } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      {
        error:
          "This credit union name is already in use. If you are the authorized representative, please contact CamCCUL headquarters.",
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ available: true });
}
