"use client";

import { useState } from "react";
import { Calendar, Newspaper } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { newsArticles, newsCategoryLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/i18n";

const categories = ["All", "Circular", "Training", "COBAC", "Announcement", "Event"];

const categoryVariant: Record<
  string,
  "default" | "primary" | "accent" | "success" | "warning" | "danger"
> = {
  Circular: "primary",
  Training: "accent",
  COBAC: "warning",
  Announcement: "success",
  Event: "default",
};

const PAGE_SIZE = 5;

function formatDate(dateStr: string, language: "en" | "fr") {
  return new Date(dateStr).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles =
    selectedCategory === "All"
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  return (
    <>
      <PageHero title={t("news_page_title")} subtitle={t("news_page_subtitle")} />

      <div className="sticky top-16 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border-none",
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {localize(newsCategoryLabels[category], language)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <>
              <div>
                {paginatedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(article.publishedAt, language)}
                      </span>
                      <Badge variant={categoryVariant[article.category] ?? "default"}>
                        {localize(newsCategoryLabels[article.category] ?? newsCategoryLabels.All, language)}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-primary-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors cursor-pointer mb-2">
                      {localize(article.title, language)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {localize(article.excerpt, language)}
                    </p>
                    <span className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 cursor-pointer">
                      {t("news_read_more")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  {t("news_previous")}
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("news_page_label")} {currentPage} {t("news_of_label")} {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  {t("news_next")}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Newspaper className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">{t("news_empty_title")}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {t("news_empty_subtitle")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
