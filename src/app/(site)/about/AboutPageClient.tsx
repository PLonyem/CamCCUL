"use client";

import { Shield, Eye, User } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { affiliates, regions, regionLabels, mission, vision, leadership, milestones } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const regionCounts = regions.map((region) => ({
  region,
  count: affiliates.filter((affiliate) => affiliate.region === region).length,
}));

export function AboutPageClient() {
  const { t, language } = useLanguage();

  return (
    <>
      {/* SECTION 0: PAGE HERO */}
      <PageHero
        title={t("about_page_title")}
        breadcrumb={[
          { label: t("nav_home"), href: "/" },
          { label: t("nav_about"), href: "/about" },
        ]}
      />

      {/* SECTION 1: OUR STORY */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeader
            title={t("about_history_title")}
            subtitle={t("about_history_subtitle")}
          />

          <div className="relative mt-16">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-primary-200" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={milestone.year} className="relative pl-14 md:pl-0">
                    <span className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-md ring-4 ring-white">
                      {milestone.year === "Present" ? t("about_milestone_present") : milestone.year}
                    </span>

                    <div
                      className={cn(
                        "md:w-[calc(50%-3rem)]",
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      )}
                    >
                      <Card className="p-6">
                        <h3 className="font-display font-semibold text-lg text-primary-900">
                          {localize(milestone.title, language)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {localize(milestone.description, language)}
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
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title={t("about_mission_vision_title")}
            subtitle={t("about_mission_vision_subtitle")}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="w-fit rounded-full bg-primary-100 p-4 mb-4">
                <Shield className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary-900">
                {t("about_mission_title")}
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {localize(mission, language)}
              </p>
            </div>

            <div className="h-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="w-fit rounded-full bg-accent-100 p-4 mb-4">
                <Eye className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary-900">
                {t("about_vision_title")}
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {localize(vision, language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LEADERSHIP */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title={t("about_leadership_title")}
            subtitle={t("about_leadership_subtitle")}
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <div
                key={`${member.name.en}-${index}`}
                className="flex flex-col items-center text-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <p className="font-semibold text-lg text-primary-900">
                  {localize(member.name, language)}
                </p>
                <p className="text-sm text-accent-600 font-medium mt-1">
                  {localize(member.title, language)}
                </p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-4">
                  {localize(member.bio, language)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: REGIONAL PRESENCE */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            align="center"
            title={t("about_presence_title")}
            subtitle={t("about_presence_subtitle")}
          />

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionCounts.map(({ region, count }) => (
              <div
                key={region}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"
              >
                <p className="font-semibold text-sm text-primary-900">
                  {localize(regionLabels[region], language)}
                </p>
                <p className="font-display text-3xl font-bold text-primary-600 mt-2">
                  {count}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-gray-600 max-w-3xl mx-auto">
            {t("about_presence_paragraph")}
          </p>
        </div>
      </section>
    </>
  );
}
