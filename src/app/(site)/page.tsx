import { prisma } from "@/lib/prisma";
import {
  regions,
  affiliates as mockAffiliates,
  newsArticles as mockArticles,
} from "@/lib/mock-data";
import { HomeClient, type HomeRecentArticle } from "./HomeClient";

// This page has no cookies()/headers()/searchParams usage, so Next.js would
// otherwise treat it as fully static and prerender it once at build time —
// meaning every Homepage Editor save (all Content/Appearance/Sections
// fields) would only reach the live site on the *next deployment*, not
// immediately. Forcing it dynamic makes getHomeData() run fresh on every
// request instead.
export const dynamic = "force-dynamic";

export interface SectionVisibility {
  showHero: boolean;
  showStats: boolean;
  showMission: boolean;
  showServices: boolean;
  showReach: boolean;
  showNews: boolean;
}

const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  showHero: true,
  showStats: true,
  showMission: true,
  showServices: true,
  showReach: true,
  showNews: true,
};

export interface HeroOverlay {
  show: boolean;
  color: string;
  opacity: number;
}

const DEFAULT_HERO_OVERLAY: HeroOverlay = {
  show: true,
  color: "#000000",
  opacity: 0,
};

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  images: string[];
  backgroundColor: string;
  gradientDirection: "to-r" | "to-b" | "to-br" | "to-bl";
  textAlignment: "left" | "center" | "right";
  buttonStyle: "solid" | "outline" | "ghost";
}

const DEFAULT_HERO_CONTENT: HeroContent = {
  badge: "Cameroon Cooperative Credit Union League",
  title: "Owned by members. Built for communities.",
  subtitle:
    "CamCCUL supervises and empowers cooperative credit unions across Cameroon, extending safe, affordable financial services to every region.",
  primaryButtonText: "Find a credit union near you",
  primaryButtonLink: "/affiliates",
  secondaryButtonText: "Become an affiliate",
  secondaryButtonLink: "/contact",
  images: [],
  backgroundColor: "#0A2647",
  gradientDirection: "to-br",
  textAlignment: "left",
  buttonStyle: "solid",
};

export interface HeroStats {
  affiliates: number;
  members: string;
  assets: string;
}

const DEFAULT_HERO_STATS: HeroStats = {
  affiliates: 216,
  members: "50,000+",
  assets: "",
};

interface HomeData {
  affiliateCount: number;
  regionCounts: { region: string; count: number }[];
  recentArticles: HomeRecentArticle[];
  sectionVisibility: SectionVisibility;
  heroOverlay: HeroOverlay;
  heroContent: HeroContent;
  heroStats: HeroStats;
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [affiliateCount, groupedRegions, articlesEn, articlesFr, homepageContent] =
      await Promise.all([
        prisma.affiliate.count(),
        prisma.affiliate.groupBy({ by: ["region"], _count: { _all: true } }),
        prisma.newsArticle.findMany({
          where: { published: true, language: "en" },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            slug: true,
            language: true,
            category: true,
            excerpt: true,
            publishedAt: true,
            createdAt: true,
          },
        }),
        prisma.newsArticle.findMany({
          where: { published: true, language: "fr" },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            slug: true,
            language: true,
            category: true,
            excerpt: true,
            publishedAt: true,
            createdAt: true,
          },
        }),
        prisma.homepageContent.findUnique({
          where: { id: "default" },
          select: {
            showHero: true,
            showStats: true,
            showMission: true,
            showServices: true,
            showReach: true,
            showNews: true,
            showOverlay: true,
            overlayColor: true,
            overlayOpacity: true,
            heroBadge: true,
            heroTitle: true,
            heroSubtitle: true,
            primaryButtonText: true,
            primaryButtonLink: true,
            secondaryButtonText: true,
            secondaryButtonLink: true,
            heroImages: true,
            backgroundColor: true,
            gradientDirection: true,
            textAlignment: true,
            buttonStyle: true,
            statsAffiliates: true,
            statsMembers: true,
            statsAssets: true,
          },
        }),
      ]);

    const countByRegion = new Map(
      groupedRegions.map((g) => [g.region, g._count._all])
    );
    const regionCounts = regions.map((region) => ({
      region,
      count: countByRegion.get(region) ?? 0,
    }));

    const recentArticles: HomeRecentArticle[] = [
      ...articlesEn,
      ...articlesFr,
    ].map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      language: article.language,
      category: article.category,
      excerpt: article.excerpt,
      publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
    }));

    return {
      affiliateCount,
      regionCounts,
      recentArticles,
      sectionVisibility: homepageContent ?? DEFAULT_SECTION_VISIBILITY,
      heroOverlay: homepageContent
        ? {
            show: homepageContent.showOverlay,
            color: homepageContent.overlayColor,
            opacity: homepageContent.overlayOpacity,
          }
        : DEFAULT_HERO_OVERLAY,
      heroContent: homepageContent
        ? {
            badge: homepageContent.heroBadge,
            title: homepageContent.heroTitle,
            subtitle: homepageContent.heroSubtitle,
            primaryButtonText: homepageContent.primaryButtonText,
            primaryButtonLink: homepageContent.primaryButtonLink,
            secondaryButtonText: homepageContent.secondaryButtonText,
            secondaryButtonLink: homepageContent.secondaryButtonLink,
            images: homepageContent.heroImages as string[],
            backgroundColor: homepageContent.backgroundColor,
            gradientDirection:
              homepageContent.gradientDirection as HeroContent["gradientDirection"],
            textAlignment: homepageContent.textAlignment as HeroContent["textAlignment"],
            buttonStyle: homepageContent.buttonStyle as HeroContent["buttonStyle"],
          }
        : DEFAULT_HERO_CONTENT,
      heroStats: homepageContent
        ? {
            affiliates: homepageContent.statsAffiliates,
            members: homepageContent.statsMembers,
            assets: homepageContent.statsAssets,
          }
        : DEFAULT_HERO_STATS,
    };
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock home data:",
      error
    );

    const activeAffiliates = mockAffiliates.filter((a) => a.isActive);
    const regionCounts = regions.map((region) => ({
      region,
      count: activeAffiliates.filter((a) => a.region === region).length,
    }));

    const recentArticles: HomeRecentArticle[] = (["en", "fr"] as const).flatMap(
      (lang) =>
        mockArticles
          .filter((a) => a.language === lang)
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
          .slice(0, 3)
          .map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            language: article.language,
            category: article.category,
            excerpt: article.excerpt,
            publishedAt: article.publishedAt,
          }))
    );

    return {
      affiliateCount: activeAffiliates.length,
      regionCounts,
      recentArticles,
      sectionVisibility: DEFAULT_SECTION_VISIBILITY,
      heroOverlay: DEFAULT_HERO_OVERLAY,
      heroContent: DEFAULT_HERO_CONTENT,
      heroStats: DEFAULT_HERO_STATS,
    };
  }
}

export default async function Home() {
  const {
    affiliateCount,
    regionCounts,
    recentArticles,
    sectionVisibility,
    heroOverlay,
    heroContent,
    heroStats,
  } = await getHomeData();

  return (
    <HomeClient
      affiliateCount={affiliateCount}
      regionCounts={regionCounts}
      recentArticles={recentArticles}
      sectionVisibility={sectionVisibility}
      heroOverlay={heroOverlay}
      heroContent={heroContent}
      heroStats={heroStats}
    />
  );
}
