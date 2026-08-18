import { UserPlus } from "lucide-react";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export default function AdminCreateAccountPage() {
  return (
    <AdminComingSoon
      title="Create Account"
      icon={UserPlus}
      description="A general-purpose account creation tool (admin or credit union) is coming soon. To create a credit union login today, open the affiliate's edit page and use its Credit Union Login section."
    />
  );
}
