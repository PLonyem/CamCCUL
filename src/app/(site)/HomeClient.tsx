"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Building2,
  Globe,
  Calendar,
  GraduationCap,
  FileSearch,
  Network,
} from "lucide-react";
import { regions, regionLabels, services } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";

const yearsOfService = new Date().getFullYear() - 1968;

const serviceIcons: Record<string, LucideIcon> = {
  Shield,
  FileSearch,
  GraduationCap,
  Network,
};

const serviceTranslationKeys: Record<string, { titleKey: TranslationKey; shortDescriptionKey: TranslationKey }> = {
  "/services/regulatory-supervision": {
    titleKey: "nav_services_regulatory",
    shortDescriptionKey: "home_service_regulatory_short",
  },
  "/services/financial-auditing": {
    titleKey: "nav_services_auditing",
    shortDescriptionKey: "home_service_auditing_short",
  },
  "/services/capacity-building": {
    titleKey: "nav_services_capacity",
    shortDescriptionKey: "home_service_capacity_short",
  },
  "/services/digitalization": {
    titleKey: "nav_services_digitalization",
    shortDescriptionKey: "home_service_digitalization_short",
  },
};

function formatDate(dateStr: string, language: "en" | "fr") {
  return new Date(dateStr).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export interface HomeRecentArticle {
  id: string;
  title: string;
  slug: string;
  language: string;
  category: string;
  excerpt: string;
  publishedAt: string;
}

interface HomeClientProps {
  affiliateCount: number;
  regionCounts: { region: string; count: number }[];
  recentArticles: HomeRecentArticle[];
}

// Flat, hairline-border card shell shared by every band below — deliberately
// not the sitewide <Card> component (which pairs a border with a shadow),
// since this redesign's card rule is border OR soft shadow, never both.
function BandCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white border border-primary-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function HomeClient({ affiliateCount, regionCounts, recentArticles }: HomeClientProps) {
  const { t, language } = useLanguage();
  const regulators = ["COBAC", t("home_trust_mof"), "ANEMCAM", "ACCOSCA"];

  // Every number here is real (live count, region total, years since 1968)
  // and appears nowhere else on the page — Hero no longer duplicates them.
  const glanceStats: { icon: LucideIcon; value: string; labelKey: TranslationKey }[] = [
    { icon: Building2, value: `${affiliateCount}+`, labelKey: "home_glance_affiliates_label" },
    { icon: Globe, value: `${regions.length}`, labelKey: "home_glance_regions_label" },
    { icon: Calendar, value: `${yearsOfService}`, labelKey: "home_glance_years_label" },
  ];

  return (
    <>
      {/* BAND 3: HERO — no real CamCCUL photograph exists yet, so this is a
          solid brand-color field (no gradient, per the two-color rule)
          rather than a stock photo standing in for one. */}
      <section className="relative bg-primary-900 min-h-[85vh] md:min-h-screen flex items-center">
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-24 md:py-32 w-full">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white mb-6">
            <Shield className="h-4 w-4" aria-hidden="true" />
            {t("home_hero_badge")}
          </span>

          <h1 className="text-[32px] leading-tight md:text-6xl md:leading-tight font-display font-bold text-white max-w-3xl">
            {t("home_hero_title_prefix")} {affiliateCount}+ {t("home_hero_title_suffix")}
          </h1>

          <p className="text-base md:text-lg leading-[1.6] text-primary-100 mt-6 max-w-xl">
            {t("home_hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/affiliates"
              className="inline-flex items-center rounded-lg bg-primary-500 hover:bg-primary-400 text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              {t("nav_find_credit_union")}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {t("home_hero_button")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 4: THE LEAGUE AT A GLANCE — white */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
            {t("home_glance_title")}
          </h2>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {glanceStats.map((stat) => (
              <div key={stat.labelKey} className="text-center md:text-left">
                <stat.icon className="h-6 w-6 text-primary-500 mx-auto md:mx-0 mb-3" aria-hidden="true" />
                <p className="text-4xl md:text-5xl font-display font-bold text-primary-500">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-700 mt-2">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-12 pt-8 border-t border-primary-100 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            aria-label={t("home_trust_title")}
          >
            {regulators.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 text-xs font-medium text-primary-400"
              >
                <Shield className="h-3 w-3" aria-hidden="true" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BAND 5: WHAT WE DO — pale blue tint */}
      <section className="bg-primary-500/6 py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
            {t("home_services_title")}
          </h2>
          <p className="text-base md:text-lg leading-[1.6] text-primary-700 max-w-2xl mt-4">
            {t("home_what_we_do_subtitle")}
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Shield;
              const translation = serviceTranslationKeys[service.href];
              return (
                <BandCard key={service.title} className="p-6 flex flex-col h-full">
                  <Icon className="h-7 w-7 text-primary-500 mb-4" aria-hidden="true" strokeWidth={1.5} />
                  <h3 className="font-display font-semibold text-lg text-primary-900">
                    {translation ? t(translation.titleKey) : service.title}
                  </h3>
                  <p className="text-base leading-[1.6] text-primary-700 mt-2 flex-1">
                    {translation ? t(translation.shortDescriptionKey) : service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 mt-4"
                  >
                    {t("home_learn_more")}
                  </Link>
                </BandCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* BAND 6: ABOUT CAMCCUL — white. No real photograph exists yet, so
          the right column is a plain brand panel rather than a stock image
          standing in for one. */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
                {t("home_about_title")}
              </h2>
              <p className="text-base md:text-lg leading-[1.6] text-primary-700 mt-8">
                {t("footer_about")}
              </p>
              <p className="text-base leading-[1.6] text-primary-700 mt-4">
                {t("about_presence_paragraph")}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 mt-8"
              >
                {t("about_read_more")}
              </Link>
            </div>

            <div
              className="hidden md:flex items-center justify-center bg-primary-500/6 border border-primary-100 rounded-xl aspect-[4/3]"
              aria-hidden="true"
            >
              <Building2 className="h-16 w-16 text-primary-300" strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      {/* BAND 7: OUR REACH ACROSS CAMEROON — pale blue tint */}
      <section className="bg-primary-500/6 py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
            {t("home_affiliates_title")}
          </h2>
          <p className="text-base md:text-lg leading-[1.6] text-primary-700 max-w-2xl mt-4">
            {affiliateCount}+ {t("home_reach_subtitle_suffix")}
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {regionCounts.map(({ region, count }) => (
              <Link
                key={region}
                href={`/affiliates?region=${encodeURIComponent(region)}`}
                className="text-center bg-white border border-primary-200 rounded-xl p-4 hover:border-primary-400 transition-colors"
              >
                <p className="text-2xl font-bold text-primary-500">{count}</p>
                <p className="text-xs text-primary-700 mt-1">
                  {localize(regionLabels[region], language)}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/affiliates"
              className="inline-flex items-center rounded-lg bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              {t("nav_find_credit_union")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 8: LATEST NEWS — white. No article images exist yet, so cards
          show date + title only rather than a placeholder image block. */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
            {t("home_news_title")}
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {recentArticles
              .filter((article) => article.language === language)
              .slice(0, 3)
              .map((article) => (
                <BandCard key={article.id} className="p-6 flex flex-col h-full">
                  <p className="text-xs text-primary-400">
                    {formatDate(article.publishedAt, language)}
                  </p>
                  <h3 className="font-display font-semibold text-lg text-primary-900 mt-2">
                    <Link
                      href={`/news/${article.slug}`}
                      className="hover:text-primary-500 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                </BandCard>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/news"
              className="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              {t("home_view_all")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 9: CALL TO ACTION — the page's one other solid-blue band */}
      <section className="bg-primary-500 py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-[26px] md:text-4xl font-display font-bold text-white">
            {t("nav_find_credit_union")}
          </h2>
          <p className="text-base md:text-lg leading-[1.6] text-primary-100 mt-4 max-w-xl mx-auto">
            {t("affiliates_page_subtitle")}
          </p>
          <Link
            href="/affiliates"
            className="inline-flex items-center rounded-lg bg-white hover:bg-primary-50 text-primary-700 px-6 py-3 text-sm font-medium transition-colors mt-8"
          >
            {t("nav_find_credit_union")}
          </Link>
        </div>
      </section>
    </>
  );
}
