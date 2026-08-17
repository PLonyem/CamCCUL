import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// `@clerk/backend`'s ClerkAPIResponseError.errors is the documented shape
// for validation failures (e.g. "That email address is taken"), but the
// package itself is only a transitive dependency here (pulled in by
// @clerk/nextjs), not one we can import types from directly — so this
// checks the same shape structurally instead of importing the class.
function extractClerkErrorMessage(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors: unknown }).errors)
  ) {
    const first = (error as { errors: { message?: string }[] }).errors[0];
    return first?.message ?? null;
  }
  return null;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

const bodySchema = z.object({
  email: z.string().trim().email(),
});

// Base64url avoids +, /, and = so the password is safe to paste anywhere
// without escaping, and is long enough to clear Clerk's default strength
// checks without needing a "memorable" shape — it's meant to be copied
// once and handed to the credit union, not typed by hand.
function generatePassword() {
  return randomBytes(18).toString("base64url");
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const affiliate = await prisma.affiliate.findUnique({
    where: { id },
    select: { id: true, name: true, code: true, chapter: true },
  });
  if (!affiliate) {
    return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }

  const password = generatePassword();
  const clerk = await clerkClient();

  try {
    const user = await clerk.users.createUser({
      emailAddress: [parsed.data.email],
      password,
      publicMetadata: {
        role: "credit_union",
        affiliateId: affiliate.id,
        affiliateName: affiliate.name,
        affiliateCode: affiliate.code,
        chapter: affiliate.chapter ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: parsed.data.email,
      password,
    });
  } catch (error) {
    // Surface Clerk's own message (e.g. "That email address is taken")
    // rather than a generic failure, since the admin needs to know why.
    const message =
      extractClerkErrorMessage(error) ??
      "Could not create the Clerk account. Please try again.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
