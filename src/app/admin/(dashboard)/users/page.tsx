import { Users } from "lucide-react";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export default function AdminUsersPage() {
  return (
    <AdminComingSoon
      title="All Users"
      icon={Users}
      description="A full list of admin and credit union Clerk accounts is coming soon. In the meantime, credit union logins can be created from an affiliate's edit page."
    />
  );
}
