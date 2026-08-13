"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import type { LucideIcon } from "lucide-react";
import { Shield, ShieldCheck, GraduationCap, Laptop, Lock, Building2, Users, Globe, Calendar } from "lucide-react";
import { regions, regionLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";

const yearsOfService = new Date().getFullYear() - 1968;

const valueCards: { icon: LucideIcon; titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { icon: ShieldCheck, titleKey: "home2_value_regulatory_title", bodyKey: "home2_value_regulatory_body" },
  { icon: GraduationCap, titleKey: "home2_value_capacity_title", bodyKey: "home2_value_capacity_body" },
  { icon: Laptop, titleKey: "home2_value_digital_title", bodyKey: "home2_value_digital_body" },
  { icon: Lock, titleKey: "home2_value_protection_title", bodyKey: "home2_value_protection_body" },
];

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

  // affiliateCount and regions.length are real, live-computed values used
  // elsewhere on this page too; "members served" has no data source
  // anywhere in the codebase yet, so it's a plain placeholder — flagged in
  // the chat summary as needing a real figure from CamCCUL before launch.
  const stats: { icon: LucideIcon; value: string; labelKey: TranslationKey }[] = [
    { icon: Building2, value: `${affiliateCount}+`, labelKey: "home2_stat_affiliates_label" },
    { icon: Users, value: "50,000+", labelKey: "home2_stat_members_label" },
    { icon: Globe, value: `${regions.length}`, labelKey: "home2_stat_regions_label" },
    { icon: Calendar, value: `${yearsOfService}`, labelKey: "home2_stat_years_label" },
  ];

  const heroImageCommon = { alt: t("home2_hero_image_alt"), sizes: "100vw" };
  const { props: heroWebp } = getImageProps({
    ...heroImageCommon,
    src: "/camccul-hero.webp",
    width: 2048,
    height: 1365,
    quality: 75,
  });
  const { props: heroJpgMobile } = getImageProps({
    ...heroImageCommon,
    src: "/camccul-hero-1280.jpg",
    width: 1280,
    height: 853,
    quality: 75,
  });
  const { props: heroJpgDesktop } = getImageProps({
    ...heroImageCommon,
    src: "/camccul-hero.jpg",
    width: 2048,
    height: 1365,
    quality: 75,
    preload: true,
  });

  return (
    <>
      {/* BAND 3: HERO — full-bleed CamCCUL leadership photo, dark-left
          gradient so the headline stays legible over the busiest part of
          the image, headline/CTAs confined to the left third.
          -mt-16 pulls the section up underneath the sticky Navbar's own
          h-16 box: Navbar and Hero are siblings in normal flow, not
          overlapping, so without this the "transparent" Navbar would only
          reveal the page background instead of this photo. */}
      <section
        id="home-hero"
        className="relative isolate flex items-center overflow-hidden -mt-16"
        style={{ minHeight: "clamp(420px, 62vh, 640px)" }}
      >
        <picture className="absolute inset-0 block">
          <source type="image/webp" srcSet={heroWebp.srcSet} />
          <source media="(max-width: 767px)" srcSet={heroJpgMobile.srcSet} />
          <img
            {...heroJpgDesktop}
            alt={t("home2_hero_image_alt")}
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
        </picture>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,14,20,.82) 0%, rgba(10,14,20,.55) 42%, rgba(10,14,20,.15) 75%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16 w-full">
          <div className="max-w-[620px]">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.15em] text-primary-100">
              {t("nav_tagline")}
            </p>

            <h1 className="mt-3 text-[32px] leading-tight md:text-5xl md:leading-tight font-display font-bold text-white">
              {t("home2_hero_heading_line1")}
              <br />
              {t("home2_hero_heading_line2")}
            </h1>

            <p className="mt-5 text-base md:text-lg leading-[1.6] text-white/90">
              {t("home2_hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/affiliates"
                className="inline-flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-400 text-white px-6 py-3 text-sm font-medium transition-colors w-full sm:w-auto"
              >
                {t("home2_hero_cta_primary")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                {t("home2_hero_cta_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 4: STAT STRIP — tinted band directly under the hero */}
      <section className="bg-primary-500/6 py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <stat.icon className="h-5 w-5 text-primary-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-500">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-primary-700 mt-1">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAND 4B: VALUE CARDS */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="sr-only">{t("home2_values_sr_heading")}</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueCards.map((card) => (
              <BandCard key={card.titleKey} className="p-6">
                <card.icon className="h-6 w-6 text-primary-500 mb-3" aria-hidden="true" />
                <h3 className="font-display font-semibold text-lg text-primary-900">
                  {t(card.titleKey)}
                </h3>
                <p className="text-sm text-primary-700 mt-2 leading-[1.6]">{t(card.bodyKey)}</p>
              </BandCard>
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

      {/* BAND 5: OUR REACH ACROSS CAMEROON — pale blue tint */}
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

      {/* BAND 6: LATEST NEWS — white. No article images exist yet, so cards
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

      {/* BAND 7: CALL TO ACTION — the page's one other solid-blue band */}
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
