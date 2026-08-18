import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validation/create-user";
import { extractClerkErrorMessage, generateClerkPassword } from "@/lib/clerk-admin-utils";

export interface AdminUserListItem {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  affiliateId: string | null;
  affiliateName: string | null;
  affiliateCode: string | null;
  createdAt: number;
  lastSignInAt: number | null;
  banned: boolean;
}

// Lists every Clerk user (admin and credit_union both — Clerk has no
// concept of "which of my apps this account belongs to" beyond
// publicMetadata, so there's nothing to filter by at the API level).
// limit:200 is well above this org's actual user count (single-digit
// admins, up to 216 possible credit union chapters) — raise it if that
// stops being true rather than adding pagination pre-emptively.
export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const { data } = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" });

  const users: AdminUserListItem[] = data.map((user) => ({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    name: user.fullName,
    role: (user.publicMetadata as { role?: string })?.role ?? null,
    affiliateId: (user.publicMetadata as { affiliateId?: string })?.affiliateId ?? null,
    affiliateName: (user.publicMetadata as { affiliateName?: string })?.affiliateName ?? null,
    affiliateCode: (user.publicMetadata as { affiliateCode?: string })?.affiliateCode ?? null,
    createdAt: user.createdAt,
    lastSignInAt: user.lastSignInAt,
    banned: user.banned,
  }));

  return NextResponse.json({ users });
}

// General-purpose account creation — admin or credit_union, unlike
// /api/admin/affiliates/[id]/create-credit-union-login, which is scoped to
// one affiliate and only ever creates credit_union accounts. Both routes
// share the same underlying Clerk create-and-set-metadata logic; this one
// additionally supports role:"admin" (no affiliate fields at all).
export async function POST(request: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, role, affiliateId } = parsed.data;

  let publicMetadata: Record<string, unknown> = { role };
  if (role === "credit_union") {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: { id: true, name: true, code: true, chapter: true },
    });
    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }
    publicMetadata = {
      role: "credit_union",
      affiliateId: affiliate.id,
      affiliateName: affiliate.name,
      affiliateCode: affiliate.code,
      chapter: affiliate.chapter ?? undefined,
    };
  }

  const password = generateClerkPassword();
  const clerk = await clerkClient();

  try {
    const user = await clerk.users.createUser({
      emailAddress: [email],
      password,
      publicMetadata,
    });

    return NextResponse.json({ success: true, userId: user.id, email, password });
  } catch (error) {
    const message =
      extractClerkErrorMessage(error) ?? "Could not create the account. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
