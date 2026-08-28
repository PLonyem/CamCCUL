import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CAMCCUL_CHAPTERS, CHAPTER_TO_REGION } from "@/lib/chapters";
import { extractClerkErrorMessage } from "@/lib/clerk-admin-utils";
import { sendCreditUnionCredentials } from "@/lib/email";

const createCreditUnionSchema = z.object({
  name: z.string().trim().min(3, "Credit union name is required."),
  code: z.string().trim().min(2, "Code is required.").max(30).transform((value) => value.toUpperCase()),
  chapter: z.enum(CAMCCUL_CHAPTERS),
  city: z.string().trim().max(120).optional(),
  address: z.string().trim().max(240).optional(),
  phone: z.string().trim().max(50).optional(),
  email: z.string().trim().email("Enter a valid login email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  return Boolean(userId && sessionClaims?.metadata?.role === "admin");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [affiliates, clerk] = await Promise.all([
    prisma.affiliate.findMany({ orderBy: [{ chapter: "asc" }, { name: "asc" }] }),
    clerkClient(),
  ]);
  const { data: users } = await clerk.users.getUserList({ limit: 500 });
  const userByAffiliate = new Map<string, (typeof users)[number]>();
  for (const user of users) {
    const metadata = user.publicMetadata as { role?: string; affiliateId?: string };
    if (metadata.role === "credit_union" && metadata.affiliateId) {
      userByAffiliate.set(metadata.affiliateId, user);
    }
  }

  return NextResponse.json({
    creditUnions: affiliates.map((affiliate) => {
      const user = userByAffiliate.get(affiliate.id);
      return {
        id: affiliate.id,
        code: affiliate.code,
        name: affiliate.name,
        chapter: affiliate.chapter,
        email: user?.primaryEmailAddress?.emailAddress ?? affiliate.email,
        status: user ? (user.banned || user.locked ? "Inactive" : "Active") : "No Account",
      };
    }),
  });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createCreditUnionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const clerk = await clerkClient();
  const [existingAffiliate, existingUsers] = await Promise.all([
    prisma.affiliate.findUnique({ where: { code: data.code } }),
    clerk.users.getUserList({ emailAddress: [data.email] }),
  ]);
  if (existingAffiliate) {
    return NextResponse.json({ error: `Code ${data.code} is already in use.` }, { status: 409 });
  }
  if (existingUsers.data.length > 0) {
    return NextResponse.json({ error: "That login email already has an account." }, { status: 409 });
  }

  const affiliate = await prisma.affiliate.create({
    data: {
      code: data.code,
      name: data.name,
      chapter: data.chapter,
      region: CHAPTER_TO_REGION[data.chapter],
      city: data.city || null,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email,
      isActive: true,
    },
  });

  try {
    await clerk.users.createUser({
      emailAddress: [data.email],
      password: data.password,
      publicMetadata: {
        role: "credit_union",
        affiliateId: affiliate.id,
        affiliateName: affiliate.name,
        affiliateCode: affiliate.code,
        chapter: data.chapter,
      },
    });
  } catch (error) {
    await prisma.affiliate.delete({ where: { id: affiliate.id } }).catch(() => undefined);
    return NextResponse.json(
      { error: extractClerkErrorMessage(error) ?? "Could not create the login account." },
      { status: 502 }
    );
  }

  let emailSent = true;
  try {
    await sendCreditUnionCredentials({
      creditUnionName: affiliate.name,
      email: data.email,
      password: data.password,
      chapter: data.chapter,
    });
  } catch (error) {
    emailSent = false;
    console.error("Credit union credentials email failed:", error);
  }

  return NextResponse.json(
    { success: true, affiliateId: affiliate.id, emailSent },
    { status: 201 }
  );
}
