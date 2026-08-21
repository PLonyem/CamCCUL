"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Shield, ShieldCheck, GraduationCap, Laptop, Lock, Building2, Users, Globe, Calendar, Landmark } from "lucide-react";
import { regions, regionLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type TranslationKey } from "@/lib/i18n";
import { FadeUp } from "@/components/ui/FadeUp";
import { heroOverlayGradient } from "@/lib/utils";
import type { HeroContent, HeroStats } from "./page";

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

interface SectionVisibility {
  showHero: boolean;
  showStats: boolean;
  showMission: boolean;
  showServices: boolean;
  showReach: boolean;
  showNews: boolean;
}

interface HeroOverlay {
  show: boolean;
  color: string;
  opacity: number;
}

interface HomeClientProps {
  affiliateCount: number;
  regionCounts: { region: string; count: number }[];
  recentArticles: HomeRecentArticle[];
  sectionVisibility: SectionVisibility;
  heroOverlay: HeroOverlay;
  heroContent: HeroContent;
  heroStats: HeroStats;
}

// Maps the Homepage Editor's Appearance-tab enum to a real CSS gradient
// direction — kept identical to the admin's own HeroPreview mapping so the
// gradient an admin sees while editing is what ships.
const GRADIENT_DIRECTION_CSS: Record<HeroContent["gradientDirection"], string> = {
  "to-r": "to right",
  "to-b": "to bottom",
  "to-br": "to bottom right",
  "to-bl": "to bottom left",
};

// Cycles through uploaded hero images every 5 seconds, per the Homepage
// Editor's own copy ("Multiple images create an automatic slideshow every 5
// seconds"). No-op (and no timer) for 0 or 1 images.
function useHeroSlideshow(imageCount: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imageCount <= 1) return;
    const timer = window.setInterval(() => {
      // imageCount is a static server-rendered prop for this component's
      // whole lifetime (a fresh page load is what picks up an admin's
      // edit), so modulo alone keeps this in bounds — no separate
      // out-of-bounds guard needed.
      setIndex((i) => (i + 1) % imageCount);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [imageCount]);

  return index;
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

export function HomeClient({
  affiliateCount,
  regionCounts,
  recentArticles,
  sectionVisibility,
  heroOverlay,
  heroContent,
  heroStats,
}: HomeClientProps) {
  const { t, language } = useLanguage();
  const regulators = ["COBAC", t("home_trust_mof"), "ANEMCAM", "ACCOSCA"];
  const photoRef = useRef<HTMLDivElement>(null);
  useHeroParallax(photoRef);

  const hasHeroImage = heroContent.images.length > 0;
  const slideIndex = useHeroSlideshow(heroContent.images.length);
  const titleLines = heroContent.title.split("\n").filter((line) => line.trim().length > 0);

  const primaryButtonClass =
    heroContent.buttonStyle === "outline"
      ? "border border-white text-white hover:bg-white/[0.12]"
      : heroContent.buttonStyle === "ghost"
      ? "text-white underline underline-offset-4 hover:text-white/80"
      : "bg-white text-primary-700 shadow-[0_10px_30px_-8px_rgba(32,82,149,0.55)] hover:shadow-[0_14px_36px_-8px_rgba(32,82,149,0.7)]"; // solid

  const heroAlignClass =
    heroContent.textAlignment === "center"
      ? "items-center text-center mx-auto"
      : heroContent.textAlignment === "right"
      ? "items-end text-right ml-auto"
      : "items-start text-left";
  const heroButtonsJustifyClass =
    heroContent.textAlignment === "center"
      ? "justify-center"
      : heroContent.textAlignment === "right"
      ? "justify-end"
      : "justify-start";

  // Below 30% the admin overlay (Layer 2.5) barely tints the photo, so hero
  // text falls back on Layer 4's scrim alone — usually enough, but a thin
  // text-shadow is cheap insurance against a bright patch of photo landing
  // right under a letter. Skipped once the overlay is doing real work
  // (>=30%) since the text is then sitting on much more contrast already.
  const effectiveOverlayOpacity = heroOverlay.show ? heroOverlay.opacity : 0;
  const heroTextShadow: CSSProperties | undefined =
    effectiveOverlayOpacity < 30 ? { textShadow: "0 2px 4px rgba(0,0,0,0.3)" } : undefined;

  // Same shape as Layer 4's fixed legibility scrim below — dark on the side
  // the text sits on, fading to transparent — so the admin's overlay color
  // reinforces that scrim instead of washing the whole photo.
  const overlayGradientMobile = heroOverlayGradient(heroOverlay.color, effectiveOverlayOpacity, 0, 42, 82);
  const overlayGradientDesktop = heroOverlayGradient(heroOverlay.color, effectiveOverlayOpacity, 100, 30, 65);

  // Every band below the hero, in actual page order, with the flat tone it
  // renders on. Sections can be hidden independently via sectionVisibility,
  // so a section's own SectionBridge can't hard-code "the tone of whatever
  // sits immediately above it in the JSX" — that section might itself be
  // hidden. Walking backward through this list to the nearest *visible*
  // entry (see toneBefore below) is what keeps every bridge seamless no
  // matter which sections are toggled off.
  const sectionOrder = [
    { key: "showStats" as const, tone: TINT_BG },
    { key: "showMission" as const, tone: WHITE_BG },
    { key: "showReach" as const, tone: TINT_BG },
    { key: "showNews" as const, tone: WHITE_BG },
    { key: "showServices" as const, tone: BRAND_BLUE },
  ];

  // The tone of the nearest *visible* section before `index` in sectionOrder
  // — falls back to TINT_BG (what the hero's own bottom bleed always ends
  // on) if the hero is showing, or WHITE_BG (the page's own background) if
  // even the hero is hidden and nothing has rendered yet.
  function toneBefore(index: number): string {
    for (let i = index - 1; i >= 0; i--) {
      if (sectionVisibility[sectionOrder[i].key]) return sectionOrder[i].tone;
    }
    return sectionVisibility.showHero ? TINT_BG : WHITE_BG;
  }

  // Mirror of toneBefore, walking forward — what the hero's own Layer 5
  // bottom bleed should resolve into, i.e. the tone of the first visible
  // section after it (or TINT_BG if literally everything else is hidden).
  const heroBleedTarget =
    sectionOrder.find((s) => sectionVisibility[s.key])?.tone ?? TINT_BG;

  // Affiliates/Members figures come from the Homepage Editor's Statistics
  // fields (heroStats) so admin edits actually show up here — distinct from
  // the live affiliateCount used down in the Reach band, which is a real
  // count of Affiliate rows rather than an admin-entered headline number.
  // Regions/Years have no editor field (nothing to type in), so they stay
  // live-computed. Assets only appears once an admin fills it in.
  const stats: { icon: LucideIcon; value: string; labelKey: TranslationKey }[] = [
    { icon: Building2, value: `${heroStats.affiliates}+`, labelKey: "home2_stat_affiliates_label" },
    { icon: Users, value: heroStats.members, labelKey: "home2_stat_members_label" },
    { icon: Globe, value: `${regions.length}`, labelKey: "home2_stat_regions_label" },
    { icon: Calendar, value: `${yearsOfService}`, labelKey: "home2_stat_years_label" },
  ];
  if (heroStats.assets.trim().length > 0) {
    stats.push({ icon: Landmark, value: heroStats.assets, labelKey: "home2_stat_assets_label" });
  }
  const statsGridClass = stats.length === 5 ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4";

  function handleHeroImageError() {
    // Navbar listens for this to fall back to its solid bar immediately —
    // it's a sibling in the layout, not a child, so a DOM event is the
    // lightest way to reach it without wiring a shared context just for
    // this one rare edge case.
    window.dispatchEvent(new Event("hero-image-error"));
  }

  return (
    <>
      {sectionVisibility.showHero && (
      /*
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
      */
      <section
        id="home-hero"
        className="relative isolate flex items-end sm:items-center overflow-hidden -mt-16"
        style={{ minHeight: "92svh" }}
      >
        {hasHeroImage ? (
          <>
            {/* LAYER 1 — photograph(s): uploaded via the Homepage Editor's
                Content tab. Cycles automatically when more than one is set. */}
            <div ref={photoRef} className="hero-parallax-photo absolute inset-0 will-change-transform">
              <Image
                key={heroContent.images[slideIndex]}
                src={heroContent.images[slideIndex]}
                alt={t("home2_hero_image_alt")}
                fill
                priority
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
          </>
        ) : (
          /* No hero image uploaded yet — the Homepage Editor's own Content
             tab tells an admin this falls back to a gradient built from the
             Appearance tab's Background Color / Gradient Direction, mirrored
             here pixel-for-pixel against HeroPreview's own fallback. */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${GRADIENT_DIRECTION_CSS[heroContent.gradientDirection]}, ${heroContent.backgroundColor}, transparent)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* LAYER 2.5 — admin overlay: the Homepage Editor's Overlay Color/
            Opacity controls. Anchored on the same side as Layer 4's fixed
            legibility scrim (left on desktop, bottom on mobile) rather than
            washing the whole photo — matching the editor's own live preview
            pixel-for-pixel, so what an admin sees while dragging the slider
            is what ships. Skipped entirely at opacity 0 (the shipped
            default) so it costs nothing until an admin actually turns it on. */}
        {heroOverlay.show && heroOverlay.opacity > 0 && (
          <>
            <div
              className="absolute inset-0 sm:hidden"
              style={{ background: overlayGradientMobile }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 hidden sm:block"
              style={{ background: overlayGradientDesktop }}
              aria-hidden="true"
            />
          </>
        )}

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

        {/* LAYER 5 — bottom bleed: resolves into whichever section is
            actually next (heroBleedTarget), not always the stats band —
            stats can be hidden via sectionVisibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-[22vh] sm:h-[24vh]"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${heroBleedTarget} 100%)` }}
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
          <div className={`max-w-[620px] flex flex-col ${heroAlignClass}`}>
            <FadeUp hero staggerMs={120} index={0}>
              <p
                className="text-white/70 font-semibold uppercase"
                style={{ fontSize: "13px", letterSpacing: "0.14em", ...heroTextShadow }}
              >
                {heroContent.badge}
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
                  ...heroTextShadow,
                }}
              >
                {titleLines.map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </h1>
            </FadeUp>

            <FadeUp hero staggerMs={120} index={2}>
              <p
                className="mt-5 text-white/[0.82] max-w-[34ch]"
                style={{ fontSize: "20px", lineHeight: 1.6, ...heroTextShadow }}
              >
                {heroContent.subtitle}
              </p>
            </FadeUp>

            <FadeUp hero staggerMs={120} index={3}>
              <div className={`mt-8 flex flex-col sm:flex-row gap-4 ${heroButtonsJustifyClass}`}>
                <Link
                  href={heroContent.primaryButtonLink}
                  className={`inline-flex items-center justify-center ${RADIUS} px-6 py-3 text-sm font-medium transition-shadow w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${primaryButtonClass}`}
                >
                  {heroContent.primaryButtonText}
                </Link>
                <Link
                  href={heroContent.secondaryButtonLink}
                  className={`inline-flex items-center justify-center ${RADIUS} border border-white/70 text-white px-6 py-3 text-sm font-medium transition-colors w-full sm:w-auto hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                >
                  {heroContent.secondaryButtonText}
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      )}

      {sectionVisibility.showStats && (
      /* BAND 4: STAT STRIP — tinted band the hero's bottom bleed resolves
         into when the hero is showing; no SectionBridge needed here for
         that case since Layer 5 above already fulfils that role. If the
         hero is hidden, this is simply the first thing on the page. */
      <section className="py-10 md:py-14" style={{ backgroundColor: TINT_BG }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className={`grid ${statsGridClass} gap-y-8`}>
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
      )}

      {sectionVisibility.showMission && (
      /* BAND 4B: VALUE CARDS */
      <section className="relative bg-white py-16 md:py-28">
        <SectionBridge from={toneBefore(1)} to={WHITE_BG} />
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
      )}

      {sectionVisibility.showReach && (
      /* BAND 5: OUR REACH ACROSS CAMEROON — pale blue tint */
      <section className="relative py-16 md:py-28" style={{ backgroundColor: TINT_BG }}>
        <SectionBridge from={toneBefore(2)} to={TINT_BG} />
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
      )}

      {sectionVisibility.showNews && (
      /* BAND 6: LATEST NEWS — white. No article images exist yet, so cards
         show date + title only rather than a placeholder image block. */
      <section className="relative bg-white py-16 md:py-28">
        <SectionBridge from={toneBefore(3)} to={WHITE_BG} />
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
      )}

      {sectionVisibility.showServices && (
      /* BAND 7: CALL TO ACTION — the page's one other solid-blue band */
      <section className="relative bg-primary-500 py-16 md:py-28">
        <SectionBridge from={toneBefore(4)} to={BRAND_BLUE} />
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
      )}
    </>
  );
}
