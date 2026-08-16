import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { CreditUnionNavbar } from "@/components/dashboard/CreditUnionNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const role = sessionClaims?.metadata?.role;
  if (role === "admin") {
    redirect("/admin");
  }
  // Covers both a genuine role mismatch and a brand-new Clerk signup that
  // hasn't been assigned a role + affiliateId yet (see /signup) — either
  // way there's no chapter dashboard to show them.
  if (role !== "credit_union") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreditUnionNavbar user={{ name: sessionClaims?.metadata?.affiliateName }} />
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
