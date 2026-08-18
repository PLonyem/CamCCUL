import { Bell } from "lucide-react";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export default function AdminNotificationSettingsPage() {
  return (
    <AdminComingSoon
      title="Notification Settings"
      icon={Bell}
      description="Controls for the admin notification email and which profile-submission/approval emails are sent are coming soon. The underlying NotificationSettings data already exists — this page will read and write it."
    />
  );
}
