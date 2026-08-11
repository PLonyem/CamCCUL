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

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={session.user}>
      <AdminNavGuard />
      {children}
    </AdminShell>
  );
}
