import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_MESSAGES: Record<string, string> = {
  approved: "This email is already in use. Please sign in.",
  pending: "This email has already requested access. Please wait for approval.",
  rejected: "This email was previously rejected. Please contact CamCCUL headquarters.",
};

const NAME_IN_USE_MESSAGE =
  "This credit union name is already in use. If you are the authorized representative, please contact CamCCUL headquarters.";

interface CheckResult {
  emailInUse: boolean;
  emailMessage: string | null;
  nameInUse: boolean;
  nameMessage: string | null;
}

// Public, unauthenticated pre-check — called both on field blur (real-time
// validation) and again right before signUp.create() (see
// src/app/signup/page.tsx). Either or both of email/creditUnionName may be
// present; only the fields that are present get checked.
//
// A CreditUnionSignupRequest row only ever exists once its matching Clerk
// account already does (see POST /api/signup/credit-union), so an email
// match here always corresponds to a real account — Clerk's own
// signUp.create() would independently reject it too, but only with a
// generic "already exists" error. Checking here first gives a specific,
// status-aware message (pending/approved/rejected) before the applicant
// even attempts to submit.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const creditUnionName = typeof body?.creditUnionName === "string" ? body.creditUnionName.trim() : "";

  if (!email && !creditUnionName) {
    return NextResponse.json({ error: "Provide an email or credit union name to check." }, { status: 400 });
  }

  const result: CheckResult = { emailInUse: false, emailMessage: null, nameInUse: false, nameMessage: null };

  if (email) {
    const existingByEmail = await prisma.creditUnionSignupRequest.findUnique({
      where: { email },
      select: { status: true },
    });
    if (existingByEmail) {
      result.emailInUse = true;
      result.emailMessage = EMAIL_MESSAGES[existingByEmail.status] ?? EMAIL_MESSAGES.pending;
    }
  }

  if (creditUnionName) {
    if (creditUnionName.length < 3) {
      return NextResponse.json({ error: "Credit union name must be at least 3 characters." }, { status: 400 });
    }
    const existingByName = await prisma.creditUnionSignupRequest.findFirst({
      where: {
        creditUnionName: { equals: creditUnionName, mode: "insensitive" },
        ...(email ? { email: { not: email } } : {}),
      },
      select: { id: true },
    });
    if (existingByName) {
      result.nameInUse = true;
      result.nameMessage = NAME_IN_USE_MESSAGE;
    }
  }

  return NextResponse.json(result, { status: result.emailInUse || result.nameInUse ? 409 : 200 });
}
