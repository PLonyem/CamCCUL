import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendAccountApprovedEmail } from "@/lib/email";

// Maps a SIGNUP_CHAPTERS value ("Northwest Chapter") to the region code
// Affiliate.region uses ("NORTHWEST") and the two-letter prefix its
// Affiliate.code values use ("NW-001", "NW-002", ...) — confirmed against
// every existing code in src/lib/mock-data.ts rather than assumed (e.g.
// South is "SO", not "SW" — that's Southwest).
const CHAPTER_TO_REGION: Record<string, { region: string; codePrefix: string }> = {
  "Northwest Chapter": { region: "NORTHWEST", codePrefix: "NW" },
  "Southwest Chapter": { region: "SOUTHWEST", codePrefix: "SW" },
  "Littoral Chapter": { region: "LITTORAL", codePrefix: "LT" },
  "Centre Chapter": { region: "CENTRE", codePrefix: "CE" },
  "West Chapter": { region: "WEST", codePrefix: "WE" },
  "Adamawa Chapter": { region: "ADAMAWA", codePrefix: "AD" },
  "North Chapter": { region: "NORTH", codePrefix: "NO" },
  "Far North Chapter": { region: "FAR NORTH", codePrefix: "FN" },
  "East Chapter": { region: "EAST", codePrefix: "EA" },
  "South Chapter": { region: "SOUTH", codePrefix: "SO" },
};

// Next sequential code for a chapter's prefix (NW-001, NW-002, ...),
// zero-padded to 3 digits to match every existing code. Doesn't lock
// against a concurrent approval for the same chapter generating the same
// number — acceptable for a single-admin, occasional-approval tool; not
// worth a transaction/advisory-lock for this traffic level.
async function nextAffiliateCode(codePrefix: string): Promise<string> {
  const existing = await prisma.affiliate.findMany({
    where: { code: { startsWith: `${codePrefix}-` } },
    select: { code: true },
  });
  const maxNumber = existing.reduce((max, { code }) => {
    const n = Number(code.slice(codePrefix.length + 1));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `${codePrefix}-${String(maxNumber + 1).padStart(3, "0")}`;
}

// Approving a signup request has to fully activate the account in one
// step — creating the Affiliate record itself (named/chaptered from what
// the applicant entered at signup, everything else blank for them to fill
// in via /dashboard/profile, the same "Complete Your Profile" flow every
// other chapter uses), then granting role: "credit_union" +
// affiliateId/affiliateName/affiliateCode in Clerk publicMetadata. Doing
// only the role half (an earlier version of this route) left approved
// accounts stuck on dashboard/page.tsx's "Almost There" fallback
// indefinitely, since nothing else ever created or linked the record.
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

  const chapterInfo = CHAPTER_TO_REGION[signupRequest.chapter];
  if (!chapterInfo) {
    return NextResponse.json({ error: `Unrecognized chapter: ${signupRequest.chapter}` }, { status: 400 });
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

  // Affiliate created (DB) before Clerk metadata is updated, so a failure
  // partway through never leaves the Clerk account pointing at an
  // affiliateId that doesn't exist — worst case here is an unused,
  // orphaned Affiliate row, not a broken account.
  const code = await nextAffiliateCode(chapterInfo.codePrefix);
  const affiliate = await prisma.affiliate.create({
    data: {
      code,
      name: signupRequest.creditUnionName,
      region: chapterInfo.region,
      chapter: signupRequest.chapter,
      email: signupRequest.email,
      isActive: true,
    },
  });

  await clerk.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: {
      role: "credit_union",
      affiliateId: affiliate.id,
      affiliateName: affiliate.name,
      affiliateCode: affiliate.code,
      chapter: signupRequest.chapter,
    },
  });

  const updated = await prisma.creditUnionSignupRequest.update({
    where: { id },
    data: { status: "approved", rejectionReason: null, affiliateId: affiliate.id },
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
