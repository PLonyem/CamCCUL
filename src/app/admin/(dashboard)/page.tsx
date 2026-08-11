import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Newspaper, CheckCircle2, Building2, Mail } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

const statCardColors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  teal: "bg-teal-50 text-teal-600",
  amber: "bg-amber-50 text-amber-600",
} as const;

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: keyof typeof statCardColors;
  href?: string;
}) {
  const content = (
    <Card className="p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${statCardColors[color]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();

  const [totalArticles, publishedArticles, totalAffiliates, unreadMessages] =
    await Promise.all([
      prisma.newsArticle.count(),
      prisma.newsArticle.count({ where: { published: true } }),
      prisma.affiliate.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {session?.user.name ?? "Admin"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Articles"
          value={totalArticles}
          icon={Newspaper}
          color="blue"
          href="/admin/news"
        />
        <StatCard
          label="Published"
          value={publishedArticles}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Total Affiliates"
          value={totalAffiliates}
          icon={Building2}
          color="teal"
          href="/admin/affiliates"
        />
        <StatCard
          label="Unread Messages"
          value={unreadMessages}
          icon={Mail}
          color="amber"
          href="/admin/messages"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/news/new"
            className={buttonVariants({ variant: "default" })}
          >
            New Article
          </Link>
          <Link
            href="/admin/affiliates/new"
            className={buttonVariants({ variant: "outline" })}
          >
            Add Affiliate
          </Link>
          <Link
            href="/admin/messages"
            className={buttonVariants({ variant: "outline" })}
          >
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
