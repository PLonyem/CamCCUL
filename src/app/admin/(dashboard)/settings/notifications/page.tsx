"use client";

import { Bell } from "lucide-react";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminNotificationSettingsPage() {
  const { t } = useLanguage();
  return (
    <AdminComingSoon
      title={t("admin.notificationSettings")}
      icon={Bell}
      description={t("admin.notificationSettingsDescription")}
    />
  );
}
