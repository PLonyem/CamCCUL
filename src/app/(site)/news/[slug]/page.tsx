import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { ShareArticle } from "@/components/news/ShareArticle";
import { FadeUp } from "@/components/ui/FadeUp";
import { prisma } from "@/lib/prisma";
import { newsArticles as mockArticles, CATEGORIES, type NewsCategory } from "@/lib/mock-data";
import { localize } from "@/lib/i18n";

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

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  language: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string | null;
  chapter: string | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  publishedAt: string;
  published: boolean;
}

// Articles can be published, edited, or unpublished by an admin at any
// time, so this route must always hit the database fresh rather than
// serve a cached shell — static generation here would risk showing stale
// or (worse) unpublished content, or wrongly caching one slug's 404 shell
// for every other unmatched slug.
export const dynamic = "force-dynamic";

function formatDate(dateStr: string, isFr: boolean) {
  return new Date(dateStr).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Only the DB call itself is guarded here — this never calls notFound(),
// so the exception Next.js relies on for the not-found boundary can't get
// accidentally swallowed by this function's own error handling.
async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  try {
    const article = await prisma.newsArticle.findUnique({ where: { slug } });
    if (!article) return null;

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      language: article.language,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      authorName: article.authorName,
      authorRole: article.authorRole,
      chapter: article.chapter,
      heroImageUrl: article.heroImageUrl,
      heroImageAlt: article.heroImageAlt,
      publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
      published: article.published,
    };
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock news data:",
      error
    );
    const mock = mockArticles.find((a) => a.slug === slug);
    if (!mock) return null;

    return {
      id: mock.id,
      title: mock.title,
      slug: mock.slug,
      language: mock.language,
      category: mock.category,
      excerpt: mock.excerpt,
      content: mock.content,
      authorName: mock.author.name,
      authorRole: mock.author.role,
      chapter: mock.chapter ?? null,
      heroImageUrl: mock.heroImage.url || null,
      heroImageAlt: mock.heroImage.alt || null,
      publishedAt: mock.publishedAt,
      published: true,
    };
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    return { title: "Article Not Found — CamCCUL" };
  }

  return {
    title: `${article.title} — CamCCUL`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const isFr = article.language === "fr";

  const categoryLabel = localize(
    CATEGORIES.find((c) => c.value === article.category)?.label ?? {
      en: article.category,
      fr: article.category,
    },
    isFr ? "fr" : "en"
  );
  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <PageHero
        title={article.title}
        breadcrumb={[
          { label: isFr ? "Accueil" : "Home", href: "/" },
          { label: isFr ? "Actualités" : "News", href: "/news" },
          { label: article.title, href: `/news/${article.slug}` },
        ]}
      />

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <FadeUp>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant={categoryVariant[article.category as NewsCategory] ?? "default"}>
              {categoryLabel}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt, isFr)}
            </span>
            {article.chapter && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="h-3.5 w-3.5" />
                {article.chapter}
              </span>
            )}
          </div>

          {article.heroImageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
              <Image
                src={article.heroImageUrl}
                alt={article.heroImageAlt ?? ""}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="text-gray-700 leading-relaxed space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-200">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{article.authorName}</p>
              <p className="text-xs text-gray-500">{article.authorRole}</p>
            </div>
          </div>

          <ShareArticle title={article.title} slug={article.slug} />

          <div className="mt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFr ? "Retour aux actualités" : "Back to News"}
            </Link>
          </div>
          </FadeUp>
        </div>
      </div>
    </>
  );
}
