import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNavGuard } from "@/components/admin/AdminNavGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  // Any authenticated Clerk user could be a credit_union account — a
  // chapter session must never reach the admin shell.
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    redirect("/login");
  }

  const user = await currentUser();

  return (
    <AdminShell
      user={{
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
      }}
    >
      <AdminNavGuard />
      {children}
    </AdminShell>
  );
}
