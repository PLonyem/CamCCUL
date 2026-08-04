"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 mx-auto" />
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">{t("loading_text")}</p>
      </div>
    </div>
  );
}
