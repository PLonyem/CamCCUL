"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FadeUp } from "./FadeUp";
import { ImageSlot } from "./ImageSlot";

// SECTION 7 — Team. White. Three city teams; hover lifts the card 2px
// with a soft blue-tinted shadow (a small, user-triggered hover cue, not
// the kind of ambient motion prefers-reduced-motion is meant to suppress).
export function Team() {
  const { t } = useLanguage();

  const teams = [
    { cityKey: "about_v2_team_bamenda" as const, label: "The Bamenda team" },
    { cityKey: "about_v2_team_douala" as const, label: "The Douala team" },
    { cityKey: "about_v2_team_fako" as const, label: "The Fako team" },
  ];

  return (
    <section className="bg-white py-16 md:py-[120px]">
      <div className="max-w-[1200px] mx-auto px-4">
        <FadeUp>
          <p className="text-[13px] uppercase tracking-[0.12em] text-primary-600 font-semibold">
            {t("about_v2_team_eyebrow")}
          </p>
          <h2 className="mt-3 text-[28px] md:text-[40px] font-display font-bold leading-tight text-primary-900">
            {t("about_v2_team_heading")}
          </h2>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team, index) => (
            <FadeUp key={team.cityKey} index={index + 1}>
              <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(32,82,149,0.25)] rounded-3xl">
                {/* IMAGE SLOT — swap for a real team photograph; pass
                    src/alt to ImageSlot. */}
                <ImageSlot label={team.label} className="aspect-square" />
                <p className="mt-4 font-display font-semibold text-lg text-primary-900">
                  {t(team.cityKey)}
                </p>
                <p className="text-[13px] uppercase tracking-[0.12em] text-primary-600 font-semibold">
                  {t("about_v2_team_caption")}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
