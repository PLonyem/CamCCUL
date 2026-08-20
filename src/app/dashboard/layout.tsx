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
  // A signed-in account with no role yet is always a credit union signup
  // awaiting admin review (see /signup) — there's no other way to end up
  // authenticated without one. DashboardPage below shows that status
  // screen instead of the real chapter dashboard; it used to redirect
  // straight to "/" here with zero explanation, which is exactly what read
  // as "nothing happened" after completing signup.

  return (
    <div className="min-h-screen bg-gray-50">
      <CreditUnionNavbar user={{ name: sessionClaims?.metadata?.affiliateName }} />
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
