import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { ShareArticle } from "@/components/news/ShareArticle";
import { newsArticles, CATEGORIES, type NewsCategory } from "@/lib/mock-data";
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

function formatDate(dateStr: string, language: "en" | "fr") {
  return new Date(dateStr).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    return { title: "Article Not Found — CamCCUL" };
  }

  return {
    title: `${article.title} — CamCCUL`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const categoryLabel = localize(
    CATEGORIES.find((c) => c.value === article.category)?.label ?? {
      en: article.category,
      fr: article.category,
    },
    article.language
  );
  const paragraphs = article.content.split("\n\n");
  const isFr = article.language === "fr";

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
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant={categoryVariant[article.category] ?? "default"}>{categoryLabel}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt, article.language)}
            </span>
            {article.chapter && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="h-3.5 w-3.5" />
                {article.chapter}
              </span>
            )}
          </div>

          {article.heroImage.url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
              <Image
                src={article.heroImage.url}
                alt={article.heroImage.alt}
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
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
              <p className="text-xs text-gray-500">{article.author.role}</p>
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
        </div>
      </div>
    </>
  );
}
