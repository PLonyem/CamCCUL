import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validation/settings";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email } = parsed.data;

  const emailTaken = await prisma.adminUser.findFirst({
    where: { email, NOT: { id: session.user.id } },
    select: { id: true },
  });
  if (emailTaken) {
    return NextResponse.json(
      { error: "That email is already in use." },
      { status: 409 }
    );
  }

  const user = await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { name, email },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
