"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Shield, ShieldCheck, GraduationCap, Laptop, Lock, Building2, Users, Globe, Calendar } from "lucide-react";
import { regions, regionLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";
import { FadeUp } from "@/components/ui/FadeUp";
import heroPhoto from "../../../public/camccul-hero.jpg";

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

// One radius, used everywhere on this page without exception (cards,
// buttons, image containers) — the polish pass's rule that inconsistent
// radii read as unfinished. Picked 14px, the midpoint of the 12-16px range.
const RADIUS = "rounded-[14px]";

// The three flat tones every section on this page resolves between. TINT is
// expressed as an actual color-mix (not a semi-transparent overlay) so a
// SectionBridge's gradient endpoint is pixel-identical to a section's own
// solid `background: TINT` — an overlay stacked on a bridge would double up
// and produce a visible seam instead of a seamless blend.
const BRAND_BLUE = "#205295";
const TINT_BG = "color-mix(in srgb, #205295 6%, white)";
const WHITE_BG = "#ffffff";

// A 96px gradient dropped at the top of a section, blending it into
// whatever solid tone the previous section ended on — replaces every hard
// horizontal seam on the page with a resolution instead of a line.
function SectionBridge({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-24 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}

// Flat, hairline-border card shell shared by every band below — deliberately
// not the sitewide <Card> component (which pairs a border with a shadow),
// since this redesign's card rule is border OR soft shadow, never both:
// flat with a hairline border at rest, lifting into a blue-tinted shadow on
// hover rather than carrying both looks at once.
function BandCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white border border-primary-500/10 ${RADIUS} transition-[transform,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(32,82,149,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

// Fires once other hero content has had a moment to paint, so the tiny
// parallax offset never fights the fade-up-on-load reveal. Reads scroll
// only for the hero's own first 400px, and is a no-op entirely for
// prefers-reduced-motion — the listener is never attached in that case.
function useHeroParallax(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function handleScroll() {
      const el = ref.current;
      if (!el) return;
      const y = Math.min(window.scrollY, 400);
      el.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);
}

export function HomeClient({ affiliateCount, regionCounts, recentArticles }: HomeClientProps) {
  const { t, language } = useLanguage();
  const regulators = ["COBAC", t("home_trust_mof"), "ANEMCAM", "ACCOSCA"];
  const photoRef = useRef<HTMLDivElement>(null);
  useHeroParallax(photoRef);

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

  function handleHeroImageError() {
    // Navbar listens for this to fall back to its solid bar immediately —
    // it's a sibling in the layout, not a child, so a DOM event is the
    // lightest way to reach it without wiring a shared context just for
    // this one rare edge case.
    window.dispatchEvent(new Event("hero-image-error"));
  }

  return (
    <>
      {/*
        BAND 3: HERO — six stacked layers, bottom to top. Re-tune here:

        1. PHOTOGRAPH        next/image, object-cover, focal point on faces.
        2. COLOUR GRADE      mix-blend-mode:color at ~35% brand blue — shifts
                              the photo's own hues toward the brand instead of
                              veiling it. THE key layer: if faces read grey,
                              this opacity is too high; if the image still
                              looks neutral/ungraded, it's too low.
        3. DEPTH              mix-blend-mode:multiply, deep blue top-left
                              fading out by 60% — gives the image a direction
                              instead of sitting flat.
        4. LEGIBILITY SCRIM   deep blue ~88% opacity anchored under the text
                              block, angled on desktop, vertical bottom-up on
                              mobile (where text stacks below the faces).
        5. BOTTOM BLEED       transparent to the exact solid tone the stats
                              band below resolves to (TINT_BG) — removes the
                              hard line at the hero's base. Biggest single
                              contributor to the page feeling smooth.
        6. GRAIN               feTurbulence noise at ~3.5% opacity, breaks up
                              banding on the large flat-ish gradients above.

        Content sits above all six in a `relative z-10` layer.
        -mt-16 pulls the section up underneath the sticky Navbar's own h-16
        box: Navbar and Hero are siblings in normal flow, not overlapping, so
        without this the "transparent" Navbar would only reveal the page
        background instead of this photo.
      */}
      <section
        id="home-hero"
        className="relative isolate flex items-end sm:items-center overflow-hidden -mt-16"
        style={{ minHeight: "92svh" }}
      >
        {/* LAYER 1 — photograph */}
        <div ref={photoRef} className="hero-parallax-photo absolute inset-0 will-change-transform">
          <Image
            src={heroPhoto}
            alt={t("home2_hero_image_alt")}
            fill
            priority
            placeholder="blur"
            quality={75}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 22%" }}
            onError={handleHeroImageError}
          />
        </div>

        {/* LAYER 2 — colour grade: tints the photo toward brand blue */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: BRAND_BLUE, opacity: 0.35, mixBlendMode: "color" }}
          aria-hidden="true"
        />

        {/* LAYER 3 — depth: directional weight, top-left */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0A2647 0%, rgba(10,38,71,0) 60%)",
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />

        {/* LAYER 4 — legibility scrim: anchored under the text block */}
        <div
          className={[
            "absolute inset-0",
            "[background:linear-gradient(0deg,rgba(10,38,71,0.88)_0%,rgba(10,38,71,0.88)_42%,rgba(10,38,71,0)_82%)]",
            "sm:[background:linear-gradient(100deg,rgba(10,38,71,0.88)_0%,rgba(10,38,71,0.88)_30%,rgba(10,38,71,0)_65%)]",
          ].join(" ")}
          aria-hidden="true"
        />

        {/* LAYER 5 — bottom bleed: resolves into the stats band below */}
        <div
          className="absolute inset-x-0 bottom-0 h-[22vh] sm:h-[24vh]"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${TINT_BG} 100%)` }}
          aria-hidden="true"
        />

        {/* LAYER 6 — grain: breaks up banding on the gradients above */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16 sm:py-24 w-full">
          <div className="max-w-[620px]">
            <FadeUp hero staggerMs={120} index={0}>
              <p
                className="text-white/70 font-semibold uppercase"
                style={{ fontSize: "13px", letterSpacing: "0.14em" }}
              >
                {t("nav_tagline")}
              </p>
            </FadeUp>

            <FadeUp hero staggerMs={120} index={1}>
              <h1
                className="mt-3 font-display font-medium text-white"
                style={{
                  fontSize: "clamp(40px, 5.6vw, 78px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  textWrap: "balance",
                }}
              >
                {t("home2_hero_heading_line1")}
                <br />
                {t("home2_hero_heading_line2")}
              </h1>
            </FadeUp>

            <FadeUp hero staggerMs={120} index={2}>
              <p className="mt-5 text-white/[0.82] max-w-[34ch]" style={{ fontSize: "20px", lineHeight: 1.6 }}>
                {t("home2_hero_subtitle")}
              </p>
            </FadeUp>

            <FadeUp hero staggerMs={120} index={3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/affiliates"
                  className={`inline-flex items-center justify-center ${RADIUS} bg-white text-primary-700 px-6 py-3 text-sm font-medium transition-shadow w-full sm:w-auto shadow-[0_10px_30px_-8px_rgba(32,82,149,0.55)] hover:shadow-[0_14px_36px_-8px_rgba(32,82,149,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                >
                  {t("home2_hero_cta_primary")}
                </Link>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center ${RADIUS} border border-white/70 text-white px-6 py-3 text-sm font-medium transition-colors w-full sm:w-auto hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                >
                  {t("home2_hero_cta_secondary")}
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* BAND 4: STAT STRIP — tinted band the hero's bottom bleed resolves
          into; no SectionBridge needed here since Layer 5 above already
          fulfils that role for this specific boundary. */}
      <section className="py-10 md:py-14" style={{ backgroundColor: TINT_BG }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
            {stats.map((stat, index) => (
              <FadeUp key={stat.labelKey} index={index} staggerMs={70} refined className="relative text-center px-4">
                {index > 0 && (
                  <span
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-10 w-px bg-primary-500/12"
                    aria-hidden="true"
                  />
                )}
                <stat.icon className="h-5 w-5 text-primary-500 mx-auto mb-2" aria-hidden="true" />
                <p
                  className="font-display font-normal text-primary-500"
                  style={{ fontSize: "clamp(36px, 4.4vw, 56px)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-primary-700/60 font-semibold uppercase mt-1"
                  style={{ fontSize: "11px", letterSpacing: "0.1em" }}
                >
                  {t(stat.labelKey)}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* BAND 4B: VALUE CARDS */}
      <section className="relative bg-white py-16 md:py-28">
        <SectionBridge from={TINT_BG} to={WHITE_BG} />
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="sr-only">{t("home2_values_sr_heading")}</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueCards.map((card, index) => (
              <FadeUp key={card.titleKey} index={index} staggerMs={70} refined>
                <BandCard className="p-6 h-full">
                  <card.icon className="h-6 w-6 text-primary-500 mb-3" aria-hidden="true" />
                  <h3 className="font-display font-semibold text-lg text-primary-900">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm text-primary-700 mt-2 leading-[1.6]">{t(card.bodyKey)}</p>
                </BandCard>
              </FadeUp>
            ))}
          </div>

          <FadeUp
            refined
            className="mt-12 pt-8 border-t border-primary-500/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            <div aria-label={t("home_trust_title")} className="contents">
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
          </FadeUp>
        </div>
      </section>

      {/* BAND 5: OUR REACH ACROSS CAMEROON — pale blue tint */}
      <section className="relative py-16 md:py-28" style={{ backgroundColor: TINT_BG }}>
        <SectionBridge from={WHITE_BG} to={TINT_BG} />
        <div className="max-w-[1200px] mx-auto px-4">
          <FadeUp refined>
            <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
              {t("home_affiliates_title")}
            </h2>
            <p className="text-base md:text-lg leading-[1.6] text-primary-700 max-w-2xl mt-4">
              {affiliateCount}+ {t("home_reach_subtitle_suffix")}
            </p>
          </FadeUp>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {regionCounts.map(({ region, count }, index) => (
              <FadeUp key={region} index={index} staggerMs={70} refined>
                <Link
                  href={`/affiliates?region=${encodeURIComponent(region)}`}
                  className={`block text-center bg-white border border-primary-500/10 ${RADIUS} p-4 transition-[transform,box-shadow,border-color] duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-[0_12px_28px_-8px_rgba(32,82,149,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
                >
                  <p className="text-2xl font-bold text-primary-500">{count}</p>
                  <p className="text-xs text-primary-700 mt-1">
                    {localize(regionLabels[region], language)}
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/affiliates"
              className={`inline-flex items-center ${RADIUS} bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            >
              {t("nav_find_credit_union")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 6: LATEST NEWS — white. No article images exist yet, so cards
          show date + title only rather than a placeholder image block. */}
      <section className="relative bg-white py-16 md:py-28">
        <SectionBridge from={TINT_BG} to={WHITE_BG} />
        <div className="max-w-[1200px] mx-auto px-4">
          <FadeUp refined>
            <h2 className="text-[26px] md:text-4xl font-display font-bold text-primary-900">
              {t("home_news_title")}
            </h2>
          </FadeUp>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {recentArticles
              .filter((article) => article.language === language)
              .slice(0, 3)
              .map((article, index) => (
                <FadeUp key={article.id} index={index} staggerMs={70} refined>
                  <BandCard className="p-6 flex flex-col h-full">
                    <p className="text-xs text-primary-400">
                      {formatDate(article.publishedAt, language)}
                    </p>
                    <h3 className="font-display font-semibold text-lg text-primary-900 mt-2">
                      <Link
                        href={`/news/${article.slug}`}
                        className="hover:text-primary-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </BandCard>
                </FadeUp>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/news"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            >
              {t("home_view_all")}
            </Link>
          </div>
        </div>
      </section>

      {/* BAND 7: CALL TO ACTION — the page's one other solid-blue band */}
      <section className="relative bg-primary-500 py-16 md:py-28">
        <SectionBridge from={WHITE_BG} to={BRAND_BLUE} />
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <FadeUp refined>
            <h2 className="text-[26px] md:text-4xl font-display font-bold text-white">
              {t("nav_find_credit_union")}
            </h2>
            <p className="text-base md:text-lg leading-[1.6] text-primary-100 mt-4 max-w-xl mx-auto">
              {t("affiliates_page_subtitle")}
            </p>
            <Link
              href="/affiliates"
              className={`inline-flex items-center ${RADIUS} bg-white hover:bg-primary-50 text-primary-700 px-6 py-3 text-sm font-medium transition-colors mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-500`}
            >
              {t("nav_find_credit_union")}
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
