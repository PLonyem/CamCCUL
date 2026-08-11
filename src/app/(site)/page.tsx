import { prisma } from "@/lib/prisma";
import {
  regions,
  affiliates as mockAffiliates,
  newsArticles as mockArticles,
} from "@/lib/mock-data";
import { HomeClient, type HomeRecentArticle } from "./HomeClient";

interface HomeData {
  affiliateCount: number;
  regionCounts: { region: string; count: number }[];
  recentArticles: HomeRecentArticle[];
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [affiliateCount, groupedRegions, articlesEn, articlesFr] =
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

    return { affiliateCount, regionCounts, recentArticles };
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
    };
  }
}

export default async function Home() {
  const { affiliateCount, regionCounts, recentArticles } =
    await getHomeData();

  return (
    <HomeClient
      affiliateCount={affiliateCount}
      regionCounts={regionCounts}
      recentArticles={recentArticles}
    />
  );
}
