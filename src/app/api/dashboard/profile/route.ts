import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isPlaceholder } from "@/lib/utils";
import { creditUnionProfileSchema, SERVICE_OPTIONS } from "@/lib/validation/credit-union-profile";
import {
  sendProfileSubmissionToCamCCUL,
  sendProfileUpdatedToCamCCUL,
  sendProfileConfirmationToCreditUnion,
} from "@/lib/email";

const OTHER_PREFIX = "Other: ";

// GET/POST here are both scoped to session.user.affiliateId — a chapter
// can only ever read or write its own profile, never one it passes in.
export async function GET() {
  const { userId, sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!userId || sessionClaims?.metadata?.role !== "credit_union" || !affiliateId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const affiliate = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
    select: {
      name: true,
      code: true,
      chapter: true,
      city: true,
      address: true,
      phone: true,
      email: true,
      website: true,
      yearEstablished: true,
      briefHistory: true,
      totalMembers: true,
      branchCount: true,
      services: true,
      chapterPresident: true,
      chapterSupervisor: true,
      boardSize: true,
      staffCount: true,
    },
  });

  if (!affiliate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Split the free-form "Other: <text>" entry (if present) back out of the
  // stored array so it re-populates its own field instead of being dropped
  // for not matching any of the fixed checkbox options.
  const otherEntry = affiliate.services.find((s) => s.startsWith(OTHER_PREFIX));
  const servicesOffered = affiliate.services.filter((s) =>
    (SERVICE_OPTIONS as readonly string[]).includes(s)
  );

  return NextResponse.json({
    name: affiliate.name,
    code: affiliate.code,
    chapter: affiliate.chapter ?? "",
    city: isPlaceholder(affiliate.city) ? "" : affiliate.city,
    address: isPlaceholder(affiliate.address) ? "" : affiliate.address,
    phone: isPlaceholder(affiliate.phone) ? "" : affiliate.phone,
    email: isPlaceholder(affiliate.email) ? "" : affiliate.email,
    website: affiliate.website ?? "",
    yearFounded: affiliate.yearEstablished,
    briefHistory: affiliate.briefHistory ?? "",
    totalMembers: affiliate.totalMembers,
    branchCount: affiliate.branchCount,
    servicesOffered,
    servicesOfferedOther: otherEntry ? otherEntry.slice(OTHER_PREFIX.length) : "",
    boardChairperson: affiliate.chapterPresident ?? "",
    generalManager: affiliate.chapterSupervisor ?? "",
    boardMemberCount: affiliate.boardSize,
    staffCount: affiliate.staffCount,
  });
}

export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  const affiliateId = sessionClaims?.metadata?.affiliateId;
  if (!userId || sessionClaims?.metadata?.role !== "credit_union" || !affiliateId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = creditUnionProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const services = data.servicesOfferedOther?.trim()
    ? [...data.servicesOffered, `${OTHER_PREFIX}${data.servicesOfferedOther.trim()}`]
    : data.servicesOffered;

  const existing = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
    select: { code: true, profileStatus: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // code is now editable (name/chapter too — see the schema), so unlike
  // every other field on this form it needs a uniqueness check: it's the
  // affiliate's public identifier (used in URLs, admin lookups) and has a
  // unique constraint in the database. Only checked when it actually
  // changed, to avoid a wasted query on every ordinary submission.
  if (data.code !== existing.code) {
    const codeTaken = await prisma.affiliate.findFirst({
      where: { code: data.code, NOT: { id: affiliateId } },
      select: { id: true },
    });
    if (codeTaken) {
      return NextResponse.json(
        { error: `The code "${data.code}" is already in use by another credit union.` },
        { status: 409 }
      );
    }
  }

  // Every submission through this route is a chapter (re)submitting its
  // own profile, so it always bumps profileUpdatedAt and resets status
  // back to "pending" — unlike the admin's general-purpose PUT endpoint,
  // there's no case here where the content changes but review shouldn't
  // restart. A new AffiliateSubmission row is created alongside it for
  // SubmissionTimeline's history; any of this affiliate's still-"pending"
  // rows are closed out as "superseded" first, so a resubmission before a
  // prior one was ever decided doesn't leave two simultaneous "pending"
  // entries in that history.
  const submittedAt = new Date();
  const [, affiliate] = await prisma.$transaction([
    prisma.affiliateSubmission.updateMany({
      where: { affiliateId, status: "pending" },
      data: { status: "superseded" },
    }),
    prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        name: data.creditUnionName,
        code: data.code,
        chapter: data.chapter,
        city: data.city,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website?.trim() || null,
        yearEstablished: data.yearFounded,
        briefHistory: data.briefHistory,
        totalMembers: data.totalMembers,
        branchCount: data.branchCount,
        services,
        chapterPresident: data.boardChairperson,
        chapterSupervisor: data.generalManager,
        boardSize: data.boardMemberCount,
        staffCount: data.staffCount,
        profileUpdatedAt: submittedAt,
        profileStatus: "pending",
      },
      select: { name: true, code: true, chapter: true },
    }),
    prisma.affiliateSubmission.create({
      data: { affiliateId, status: "pending", submittedAt, fieldSnapshot: data },
    }),
  ]);

  // The profile is already saved at this point — an email provider hiccup
  // shouldn't turn a successful submission into an error response, so
  // failures here are logged, not thrown.
  const submittedAtDisplay = submittedAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const adminNotification = existing.profileStatus === "approved"
    ? sendProfileUpdatedToCamCCUL
    : sendProfileSubmissionToCamCCUL;
  const notifications = [
    adminNotification({
      creditUnionName: affiliate.name,
      creditUnionCode: affiliate.code,
      chapter: affiliate.chapter ?? "Not set",
      submittedAt: submittedAtDisplay,
    }),
  ];
  // Confirmation goes to the login account's own email, not the
  // just-submitted "public contact" email field — the account holder is
  // who actually needs to know their submission was received. Clerk's
  // primaryEmailAddress isn't in the JWT (would need a custom session
  // claim), so it's fetched here rather than read off sessionClaims.
  const accountUser = await currentUser();
  const accountEmail = accountUser?.primaryEmailAddress?.emailAddress;
  if (accountEmail) {
    notifications.push(
      sendProfileConfirmationToCreditUnion({
        creditUnionName: affiliate.name,
        creditUnionEmail: accountEmail,
      })
    );
  }
  const emailResults = await Promise.allSettled(notifications);
  for (const result of emailResults) {
    if (result.status === "rejected") {
      console.error("Profile submission email failed:", result.reason);
    }
  }

  return NextResponse.json({ success: true });
}
