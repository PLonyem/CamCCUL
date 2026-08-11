import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNavGuard } from "@/components/admin/AdminNavGuard";

// Runs synchronously as the document streams in, before the sub-page's own
// markup below it is parsed — so a real reload (F5) on e.g. /admin/messages
// bounces to /admin before that page's content ever paints, instead of
// flashing it first and redirecting after React hydrates (which is what a
// useEffect-based check would do).
const RELOAD_GUARD_SCRIPT = `(function(){try{var e=performance.getEntriesByType("navigation")[0];if(e&&e.type==="reload"&&location.pathname!=="/admin"){location.replace("/admin");}}catch(err){}})();`;

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
    <>
      <script dangerouslySetInnerHTML={{ __html: RELOAD_GUARD_SCRIPT }} />
      <AdminShell user={session.user}>
        <AdminNavGuard />
        {children}
      </AdminShell>
    </>
  );
}
