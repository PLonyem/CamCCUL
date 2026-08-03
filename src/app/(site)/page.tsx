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
import { buttonVariants } from "@/components/ui/Button";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import { cn } from "@/lib/utils";
import { affiliates, regions, mission, services, newsArticles } from "@/lib/mock-data";

const yearsOfService = new Date().getFullYear() - 1968;

const glanceStats: { icon: LucideIcon; value: string; label: string; trend: string }[] = [
  {
    icon: Building2,
    value: `${affiliates.length}+`,
    label: "Affiliated Credit Unions",
    trend: "Live count from directory",
  },
  {
    icon: Globe,
    value: `${regions.length}`,
    label: "Regions Covered",
    trend: "All of Cameroon",
  },
  {
    icon: Calendar,
    value: `${yearsOfService}`,
    label: "Years of Service",
    trend: "Since 1968",
  },
  {
    icon: Users,
    value: "[TBD]",
    label: "Members Served",
    trend: "[Data pending]",
  },
];

const trustBar = ["COBAC", "Ministry of Finance", "ANEMCAM", "ACCOSCA"];

const placeholderCardDescription =
  "[Service description to be provided by CamCCUL. This placeholder demonstrates the services section layout.]";

const missionCards: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Shield, title: "Regulatory Supervision", description: placeholderCardDescription },
  { icon: GraduationCap, title: "Capacity Building", description: placeholderCardDescription },
  { icon: Users, title: "Financial Inclusion", description: placeholderCardDescription },
];

const serviceIcons: Record<string, LucideIcon> = {
  Shield,
  FileSearch,
  GraduationCap,
  Network,
};

const regionCounts = regions.map((region) => ({
  region,
  count: affiliates.filter((affiliate) => affiliate.region === region).length,
}));

const categoryVariant: Record<
  string,
  "default" | "primary" | "accent" | "success" | "warning" | "danger"
> = {
  Circular: "primary",
  Training: "accent",
  COBAC: "warning",
  Announcement: "success",
  Event: "default",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function Home() {
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
              Regulated by COBAC
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Supervising 220+ Credit Unions Across Cameroon
            </h1>

            <p className="text-lg text-gray-200 mt-6 max-w-lg">
              Empowering financial inclusion through transparent regulation,
              modern technology, and capacity building for cooperative credit
              unions since 1968.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ComingSoonButton className={buttonVariants({ variant: "accent", size: "lg" })}>
                Access Reporting Portal
                <ArrowRight className="h-5 w-5" />
              </ComingSoonButton>
              <Link
                href="#mission"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white text-white hover:bg-white/10"
                )}
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-2xl">
              <p className="text-sm uppercase tracking-wide text-gray-300 mb-4">
                League at a Glance
              </p>
              <div className="grid grid-cols-2 gap-4">
                {glanceStats.map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                    <stat.icon className="h-5 w-5 text-accent-300 mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{stat.label}</p>
                    <p className="text-[11px] text-accent-200 mt-1">
                      {stat.trend}
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
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
            Recognized &amp; Regulated By
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {trustBar.map((name) => (
              <span
                key={name}
                className="text-lg font-display font-semibold text-gray-400 dark:text-gray-500"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: MISSION */}
      <section id="mission" className="bg-white dark:bg-gray-950 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader align="center" title="Our Mission" subtitle={mission} />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {missionCards.map((card) => (
              <Card key={card.title} className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
                  <card.icon className="h-6 w-6 text-primary-700 dark:text-primary-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                  {card.description}
                </p>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 4: SERVICES */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader align="center" title="What We Do" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon] ?? Shield;
              const isLast = index === services.length - 1;
              return (
                <Card
                  key={service.title}
                  className={cn(
                    "p-6 flex flex-col",
                    isLast &&
                      "border-accent-500 dark:border-accent-400 border-2 shadow-md bg-accent-50 dark:bg-accent-700/10"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                      isLast
                        ? "bg-accent-100 dark:bg-accent-700/30"
                        : "bg-primary-100 dark:bg-primary-900/40"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isLast
                          ? "text-accent-700 dark:text-accent-300"
                          : "text-primary-700 dark:text-primary-300"
                      )}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm flex-1">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium mt-4",
                      isLast
                        ? "text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
                        : "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    )}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 5: AFFILIATES SHOWCASE */}
      <section className="bg-white dark:bg-gray-950 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <SectionHeader
            align="center"
            title="Our Reach Across Cameroon"
            subtitle="Affiliated credit unions organized across all 10 regions of Cameroon."
          />

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionCounts.map(({ region, count }) => (
              <Link
                key={region}
                href={`/affiliates?region=${encodeURIComponent(region)}`}
                className="text-center rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <p className="text-2xl font-bold text-primary-900 dark:text-white">{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                  {region.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-primary-50 dark:bg-primary-900/40 p-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900 dark:text-white">
                {regions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Regions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900 dark:text-white">
                {affiliates.length}+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Unions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900 dark:text-white">[TBD]</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-900 dark:text-white">[TBD]</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Assets</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/affiliates"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Find a Credit Union Near You
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 6: PORTAL CTA */}
      <section className="bg-primary-900 text-white py-24 text-center">
        <AnimatedSection className="max-w-3xl mx-auto px-6 flex flex-col items-center">
          <Badge variant="accent" className="mb-4">
            Affiliate Portal
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Access Your Reporting Portal
          </h2>
          <p className="text-gray-300 mt-4">
            Affiliated credit unions can submit regulatory reports, access
            circulars, and manage compliance documentation through the
            secure CamCCUL portal.
          </p>
          <ComingSoonButton
            className={cn(
              buttonVariants({ variant: "accent", size: "lg" }),
              "mt-8"
            )}
          >
            Sign In to Portal
            <ArrowRight className="h-5 w-5" />
          </ComingSoonButton>
        </AnimatedSection>
      </section>

      {/* SECTION 7: LATEST NEWS */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <AnimatedSection className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader title="Latest News & Updates" />
            <Link
              href="/news"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsArticles.slice(0, 3).map((article) => (
              <Card key={article.id} className="p-6 flex flex-col">
                <Badge
                  variant={categoryVariant[article.category] ?? "default"}
                  className="w-fit mb-3"
                >
                  {article.category}
                </Badge>
                <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm flex-1">
                  {article.excerpt}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  {formatDate(article.publishedAt)}
                </p>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* SECTION 8: FAQ */}
      <section className="bg-white dark:bg-gray-950 py-24 text-center">
        <AnimatedSection className="max-w-2xl mx-auto px-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-6">
            <HelpCircle className="h-7 w-7 text-primary-700 dark:text-primary-300" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-900 dark:text-white">
            Have Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Find answers to common questions about CamCCUL, credit unions,
            and our services.
          </p>
          <Link
            href="/faq"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8")}
          >
            View FAQs
            <ArrowRight className="h-5 w-5" />
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
