"use client";

import { UserProfile } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";

// Name/email/password now live in Clerk, not in the AdminUser Prisma row —
// Clerk's own account UI is the correct place to manage them (it handles
// current-password verification, etc. itself; the previous custom
// Profile/Password forms and their /api/admin/settings/* routes read and
// wrote a Prisma row that Clerk sign-in no longer checks at all).
export default function AdminSettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("admin.settings")}</h1>
      <UserProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-gray-200 rounded-xl",
          },
        }}
      />
    </div>
  );
}
