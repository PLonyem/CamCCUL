import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreditUnionNavbar } from "@/components/dashboard/CreditUnionNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreditUnionNavbar user={{ name: session.user.affiliateName }} />
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
