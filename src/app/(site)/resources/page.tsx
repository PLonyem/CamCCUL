"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, Download, FolderOpen } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { resources } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";

const tabs: { labelKey: TranslationKey; category: string }[] = [
  { labelKey: "resources_tab_templates", category: "ReportingTemplate" },
  { labelKey: "resources_tab_cobac", category: "COBACRegulation" },
  { labelKey: "resources_tab_training", category: "TrainingMaterial" },
  { labelKey: "resources_tab_forms", category: "Form" },
];

function fileIcon(fileType: string) {
  return fileType === "XLSX" ? FileSpreadsheet : FileText;
}

export default function ResourcesPage() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(tabs[0].category);

  const filteredResources = resources.filter(
    (resource) => resource.category === activeCategory
  );

  return (
    <>
      <PageHero title={t("resources_page_title")} subtitle={t("resources_page_subtitle")} />

      <div className="sticky top-16 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.category}
              type="button"
              onClick={() => setActiveCategory(tab.category)}
              className={cn(
                "px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                activeCategory === tab.category
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = fileIcon(resource.fileType);
                return (
                  <Card key={resource.id} className="p-6 flex flex-col h-full">
                    <Icon className="h-8 w-8 text-primary-500 mb-3" />
                    <h3 className="font-semibold text-lg text-primary-900 dark:text-white mb-2">
                      {localize(resource.title, language)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow mb-4 line-clamp-3">
                      {localize(resource.description, language)}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{resource.fileType}</Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-sm"
                      >
                        <Download className="h-4 w-4" />
                        {t("resources_download")}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <FolderOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                {t("resources_empty_title")}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {t("resources_empty_subtitle")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
