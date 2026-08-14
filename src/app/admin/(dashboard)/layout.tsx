import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNavGuard } from "@/components/admin/AdminNavGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Any authenticated session used to be enough (only AdminUser accounts
  // existed), but CreditUnionUser accounts now sign in through the same
  // /login form — a chapter session must never reach the admin shell.
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <AdminShell user={session.user}>
      <AdminNavGuard />
      {children}
    </AdminShell>
  );
}
