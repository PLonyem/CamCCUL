"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Building2,
  Globe,
  Calendar,
  Users,
  Landmark,
  FileText,
  GraduationCap,
  FileSearch,
  Network,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { regions, regionLabels, services, CATEGORIES, mission } from "@/lib/mock-data";
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

// The mission statement is authored in mock-data.ts alongside the site's
// other real-world content (contact info, affiliates); until CamCCUL
// supplies the real text it stays a placeholder, and this band hides
// itself rather than show filler copy.
const isMissionPlaceholder = mission.en.toLowerCase().includes("placeholder");

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

export function HomeClient({ affiliateCount, regionCounts, recentArticles }: HomeClientProps) {
  const { t, language } = useLanguage();
  const trustBar = ["COBAC", t("home_trust_mof"), "ANEMCAM", "ACCOSCA"];

  const allGlanceStats: { icon: LucideIcon; value: string; labelKey: TranslationKey; trendKey: TranslationKey }[] = [
    {
      icon: Building2,
      value: `${affiliateCount}+`,
      labelKey: "home_glance_affiliates_label",
      trendKey: "home_glance_affiliates_trend",
    },
    {
      icon: Globe,
      value: `${regions.length}`,
      labelKey: "home_glance_regions_label",
      trendKey: "home_glance_regions_trend",
    },
    {
      icon: Calendar,
      value: `${yearsOfService}`,
      labelKey: "home_glance_years_label",
      trendKey: "home_glance_years_trend",
    },
    {
      icon: Users,
      value: "[TBD]",
      labelKey: "home_glance_members_label",
      trendKey: "home_glance_members_trend",
    },
  ];
  const glanceStats = allGlanceStats.filter((stat) => stat.value !== "[TBD]");

  // Total Members, Assets Supervised, and Reports per Month have no data
  // source yet (no such fields exist anywhere in the schema or mock data) —
  // each card is dropped rather than showing a fabricated or "TBD" number.
  const glanceCards: { icon: LucideIcon; value: number | null; labelKey: TranslationKey }[] = [
    { icon: Building2, value: affiliateCount, labelKey: "home_glance2_active_affiliates" },
    { icon: Users, value: null, labelKey: "home_glance2_total_members" },
    { icon: Landmark, value: null, labelKey: "home_glance2_assets_supervised" },
    { icon: FileText, value: null, labelKey: "home_glance2_reports_per_month" },
  ].filter(
    (card): card is { icon: LucideIcon; value: number; labelKey: TranslationKey } =>
      card.value !== null
  );

  const missionText = localize(mission, language);

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-sm text-white mb-6">
              <Shield className="h-4 w-4" />
              {t("home_hero_badge")}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              {t("home_hero_title_prefix")} {affiliateCount}+ {t("home_hero_title_suffix")}
            </h1>

            <p className="text-lg text-gray-200 mt-6 max-w-lg">
              {t("home_hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/affiliates"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                {t("nav_find_credit_union")}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg font-medium transition-colors border border-white/40 text-white hover:bg-white/10 px-6 py-3 text-base"
              >
                {t("home_hero_button")}
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-2xl">
              <p className="text-sm uppercase tracking-wide text-gray-300 mb-4">
                {t("home_glance_title")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {glanceStats.map((stat) => (
                  <div key={stat.labelKey} className="bg-white/5 rounded-xl p-4">
                    <stat.icon className="h-5 w-5 text-accent-300 mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{t(stat.labelKey)}</p>
                    <p className="text-[11px] text-accent-200 mt-1">
                      {t(stat.trendKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-16 md:h-24 text-white"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L0,120Z"
          />
        </svg>
      </section>

      {/* BAND 2: LEAGUE AT A GLANCE */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 text-center">
            {t("home_glance_title")}
          </h2>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {glanceCards.map((card) => (
              <div
                key={card.labelKey}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full sm:w-56 text-center"
              >
                <card.icon className="h-6 w-6 text-primary-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-primary-900">
                  {card.value}+
                </p>
                <p className="text-sm text-gray-600 mt-1">{t(card.labelKey)}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
            aria-label={t("home_trust_title")}
          >
            {trustBar.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 text-xs text-gray-400"
              >
                <Shield className="h-3 w-3" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BAND 3: OUR MISSION — hidden until CamCCUL provides real copy */}
      {!isMissionPlaceholder && (
        <section className="bg-gray-50 py-14 md:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
              {t("home_mission_title")}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              {missionText}
            </p>
          </div>
        </section>
      )}

      {/* BAND 4: WHAT WE DO */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
            {t("home_services_title")}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mt-4">
            {t("home_what_we_do_subtitle")}
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Shield;
              const translation = serviceTranslationKeys[service.href];
              return (
                <Card key={service.title} className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-primary-900">
                    {translation ? t(translation.titleKey) : service.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed flex-1">
                    {translation ? t(translation.shortDescriptionKey) : service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mt-4"
                  >
                    {t("home_learn_more")}
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* BAND 5: OUR REACH ACROSS CAMEROON */}
      <section className="bg-gray-50 py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 text-center">
            {t("home_affiliates_title")}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-4 text-center">
            {affiliateCount}+ {t("home_reach_subtitle_suffix")}
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {regionCounts.map(({ region, count }) => (
              <Link
                key={region}
                href={`/affiliates?region=${encodeURIComponent(region)}`}
                className="text-center rounded-xl border border-gray-200 shadow-sm bg-white p-4 hover:border-primary-300 transition-colors"
              >
                <p className="text-2xl font-bold text-primary-900">{count}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {localize(regionLabels[region], language)}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-display font-semibold text-primary-900">
                  {t("home_reach_headquarters")}
                </p>
                <p className="text-sm text-gray-600 mt-1">Commercial Avenue, Bamenda</p>
                <p className="text-sm text-gray-600">Opposite MTN Office</p>
                <p className="font-mono text-xs text-gray-500 mt-2 select-all">
                  X42W+MRM
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/affiliates"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t("home_learn_more")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 6: LATEST NEWS (last band — gets the larger bottom padding) */}
      <section className="bg-white pt-14 md:pt-24 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
              {t("home_news_title")}
            </h2>
            <Link
              href="/news"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t("home_view_all")}
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentArticles
              .filter((article) => article.language === language)
              .slice(0, 3)
              .map((article) => (
                <Card key={article.id} className="p-6 flex flex-col h-full">
                  <Badge variant="default" className="w-fit mb-3">
                    {localize(
                      CATEGORIES.find((c) => c.value === article.category)?.label ?? {
                        en: article.category,
                        fr: article.category,
                      },
                      language
                    )}
                  </Badge>
                  <h3 className="font-display font-semibold text-lg text-primary-900">
                    <Link
                      href={`/news/${article.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(article.publishedAt, language)}
                  </p>
                  <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed flex-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
