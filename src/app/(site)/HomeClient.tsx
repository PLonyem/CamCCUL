"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  ArrowRight,
  Building2,
  Globe,
  Calendar,
  Users,
  GraduationCap,
  FileSearch,
  Network,
  HelpCircle,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FacebookIcon } from "@/components/ui/SocialIcon";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { regions, regionLabels, services, CATEGORIES, type NewsCategory } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";

const yearsOfService = new Date().getFullYear() - 1968;

const missionCards: { icon: LucideIcon; titleKey: TranslationKey }[] = [
  { icon: Shield, titleKey: "nav_services_regulatory" },
  { icon: GraduationCap, titleKey: "nav_services_capacity" },
  { icon: Users, titleKey: "home_mission_card_financial_inclusion" },
];

const serviceIcons: Record<string, LucideIcon> = {
  Shield,
  FileSearch,
  GraduationCap,
  Network,
};

const serviceTranslationKeys: Record<string, { titleKey: TranslationKey; descriptionKey: TranslationKey }> = {
  "/services/regulatory-supervision": {
    titleKey: "nav_services_regulatory",
    descriptionKey: "home_service_regulatory_desc",
  },
  "/services/financial-auditing": {
    titleKey: "nav_services_auditing",
    descriptionKey: "home_service_auditing_desc",
  },
  "/services/capacity-building": {
    titleKey: "nav_services_capacity",
    descriptionKey: "home_service_capacity_desc",
  },
  "/services/digitalization": {
    titleKey: "nav_services_digitalization",
    descriptionKey: "home_service_digitalization_desc",
  },
};

const categoryVariant: Record<
  NewsCategory,
  "default" | "primary" | "accent" | "success" | "warning" | "danger"
> = {
  "network-news": "primary",
  projects: "accent",
  "training-events": "warning",
  insights: "success",
  Circular: "danger",
  Training: "accent",
  COBAC: "primary",
  Announcement: "success",
  Event: "default",
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

export function HomeClient({ affiliateCount, regionCounts, recentArticles }: HomeClientProps) {
  const { t, language } = useLanguage();
  const trustBar = ["COBAC", t("home_trust_mof"), "ANEMCAM", "ACCOSCA"];

  const glanceStats: { icon: LucideIcon; value: string; labelKey: TranslationKey; trendKey: TranslationKey }[] = [
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-sm text-white mb-6">
              <Shield className="h-4 w-4" />
              {t("home_hero_badge")}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              {t("home_hero_title")}
            </h1>

            <p className="text-lg text-gray-200 mt-6 max-w-lg">
              {t("home_hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "accent", size: "lg" })
                )}
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

      {/* SECTION 2: TRUST BAR */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm uppercase tracking-wider text-gray-400 mb-6">
            {t("home_trust_title")}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {trustBar.map((name) => (
              <span
                key={name}
                className="text-lg font-display font-semibold text-gray-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: MISSION */}
      <section id="mission" className="bg-white py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader align="center" title={t("home_mission_title")} subtitle={t("home_mission_placeholder")} />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {missionCards.map((card) => (
              <Card key={card.titleKey} className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <card.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900">
                  {t(card.titleKey)}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {t("home_mission_card_placeholder")}
                </p>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 4: SERVICES */}
      <section className="bg-gray-50 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader align="center" title={t("home_services_title")} />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon] ?? Shield;
              const isLast = index === services.length - 1;
              const translation = serviceTranslationKeys[service.href];
              return (
                <Card
                  key={service.title}
                  className={cn(
                    "p-6 flex flex-col",
                    isLast &&
                      "border-accent-500 border-2 shadow-md bg-accent-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                      isLast
                        ? "bg-accent-100"
                        : "bg-primary-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isLast
                          ? "text-accent-700"
                          : "text-primary-700"
                      )}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-primary-900">
                    {translation ? t(translation.titleKey) : service.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm flex-1">
                    {translation ? t(translation.descriptionKey) : service.description}
                  </p>
                  <Link
                    href={service.href}
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium mt-4",
                      isLast
                        ? "text-accent-600 hover:text-accent-700"
                        : "text-primary-600 hover:text-primary-700"
                    )}
                  >
                    {t("home_learn_more")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 5: AFFILIATES SHOWCASE */}
      <section className="bg-white py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader
            align="center"
            title={t("home_affiliates_title")}
            subtitle={t("home_affiliates_subtitle")}
          />

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionCounts.map(({ region, count }) => (
              <Link
                key={region}
                href={`/affiliates?region=${encodeURIComponent(region)}`}
                className="text-center rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <p className="text-2xl font-bold text-primary-900">{count}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {localize(regionLabels[region], language)}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-primary-50 p-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900">
                {regions.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">{t("home_stat_regions")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900">
                {affiliateCount}+
              </p>
              <p className="text-sm text-gray-600 mt-1">{t("home_stat_unions")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900">[TBD]</p>
              <p className="text-sm text-gray-600 mt-1">{t("home_stat_members")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900">[TBD]</p>
              <p className="text-sm text-gray-600 mt-1">{t("home_stat_assets")}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/affiliates"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              {t("home_find_cu_button")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 6: LATEST NEWS */}
      <section className="bg-gray-50 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader title={t("home_news_title")} />
            <Link
              href="/news"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              {t("home_view_all")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentArticles
              .filter((article) => article.language === language)
              .slice(0, 3)
              .map((article) => (
                <Card key={article.id} className="p-6 flex flex-col">
                  <Badge
                    variant={categoryVariant[article.category as NewsCategory] ?? "default"}
                    className="w-fit mb-3"
                  >
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
                      className="hover:text-accent-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm flex-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    {formatDate(article.publishedAt, language)}
                  </p>
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-sm font-medium text-accent-600 hover:text-accent-700 inline-flex items-center gap-1 mt-3"
                  >
                    {t("news_read_more_cta")}
                    <ArrowRight className="h-4 w-4 inline" />
                  </Link>
                </Card>
              ))}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="bg-white py-24 text-center">
        <AnimatedSection className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <HelpCircle className="h-7 w-7 text-primary-700" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-900">
            {t("home_faq_title")}
          </h2>
          <p className="text-gray-600 mt-4">
            {t("home_faq_subtitle")}
          </p>
          <Link
            href="/faq"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8")}
          >
            {t("home_faq_button")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimatedSection>
      </section>

      {/* SECTION 8: CONNECT WITH US */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            align="center"
            title={t("home_connect_title")}
            subtitle={t("home_connect_subtitle")}
          />

          <div className="mt-12 max-w-lg mx-auto bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-2 bg-[#1877F2]" />
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1877F2]/10 flex items-center justify-center mx-auto mb-4">
                <FacebookIcon className="h-7 w-7 text-[#1877F2]" />
              </div>
              <p className="font-display text-lg font-bold text-primary-900">
                {t("home_connect_handle")}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {t("home_connect_description")}
              </p>
              <a
                href="https://www.facebook.com/CamCCUL/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
                {t("home_connect_button")}
              </a>
              <p className="text-xs text-gray-400 mt-2">{t("home_connect_note")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
