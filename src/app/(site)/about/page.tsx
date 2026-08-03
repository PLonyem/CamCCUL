import type { Metadata } from "next";
import { Shield, Eye, User } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { affiliates, regions, mission, vision, leadership, milestones } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — CamCCUL",
  description:
    "The history, mission, leadership, and regional presence of the Cameroon Cooperative Credit Union League.",
};

const regionCounts = regions.map((region) => ({
  region,
  count: affiliates.filter((affiliate) => affiliate.region === region).length,
}));

export default function AboutPage() {
  return (
    <>
      {/* SECTION 0: PAGE HERO */}
      <PageHero
        title="About CamCCUL"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      {/* SECTION 1: OUR STORY */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader
            title="Our History"
            subtitle="A legacy of service to Cameroon's cooperative credit unions since 1968."
          />

          <div className="relative mt-16">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-primary-200 dark:bg-primary-800" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={milestone.year} className="relative pl-14 md:pl-0">
                    <span className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-md ring-4 ring-white dark:ring-gray-950">
                      {milestone.year}
                    </span>

                    <div
                      className={cn(
                        "md:w-[calc(50%-3rem)]",
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      )}
                    >
                      <Card className="p-6">
                        <h3 className="font-display font-semibold text-lg text-primary-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                          {milestone.description}
                        </p>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MISSION & VISION */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title="Our Mission & Vision"
            subtitle="Guiding principles that drive our work across all 10 regions of Cameroon."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="w-fit rounded-full bg-primary-100 dark:bg-primary-900/40 p-4 mb-4">
                <Shield className="h-6 w-6 text-primary-700 dark:text-primary-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary-900 dark:text-white">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{mission}</p>
            </div>

            <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
              <div className="w-fit rounded-full bg-accent-100 dark:bg-accent-700/30 p-4 mb-4">
                <Eye className="h-6 w-6 text-accent-700 dark:text-accent-300" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary-900 dark:text-white">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title="Board of Directors"
            subtitle="The dedicated leadership guiding CamCCUL's strategic direction."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="font-semibold text-lg text-primary-900 dark:text-white">
                  {member.name}
                </p>
                <p className="text-sm text-accent-600 dark:text-accent-400 font-medium mt-1">
                  {member.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed line-clamp-4">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: REGIONAL PRESENCE */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title="Our Presence Across Cameroon"
            subtitle="220+ affiliate credit unions serving members in every region of the country."
          />

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionCounts.map(({ region, count }) => (
              <div
                key={region}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm"
              >
                <p className="font-semibold text-sm text-primary-900 dark:text-white capitalize">
                  {region.toLowerCase()}
                </p>
                <p className="font-display text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                  {count}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            CamCCUL operates as the umbrella body for affiliated credit unions
            organized across all ten regions of Cameroon. Each affiliate
            operates independently within its community while adhering to the
            regulatory, reporting, and capacity-building standards set by the
            League, allowing members nationwide to access consistent,
            cooperative financial services close to home.
          </p>
        </div>
      </section>
    </>
  );
}
