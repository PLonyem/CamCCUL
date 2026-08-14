"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, ChevronDown, Mail, MapPin, Phone, SearchX } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeUp } from "@/components/ui/FadeUp";
import { regions, regionLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize, type Language, type TranslationKey } from "@/lib/i18n";
import { isPlaceholder, cn } from "@/lib/utils";

interface PublicAffiliateProfile {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string | null;
  profileStatus: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  yearEstablished: number | null;
  briefHistory: string | null;
  totalMembers: number | null;
  branchCount: number | null;
  services: string[];
  chapterPresident: string | null;
  chapterSupervisor: string | null;
  boardSize: number | null;
  staffCount: number | null;
}

// The 10 regions double as CamCCUL's 10 administrative chapters — this
// page just presents them under "Chapter" framing rather than "Region",
// derived from the same regionLabels data rather than a separate field.
function chapterLabel(region: string, language: Language): string {
  const label = localize(regionLabels[region] ?? { en: region, fr: region }, language);
  return language === "fr" ? `Chapitre ${label}` : `${label} Chapter`;
}

function AffiliateProfileDetails({
  affiliate,
  t,
}: {
  affiliate: PublicAffiliateProfile;
  t: (key: TranslationKey) => string;
}) {
  if (affiliate.profileStatus !== "approved") {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mt-2 border border-gray-200">
        <p className="text-sm text-gray-600">{t("affiliates_profile_pending_message")}</p>
      </div>
    );
  }

  const hasAddress = !isPlaceholder(affiliate.address);
  const hasPhone = !isPlaceholder(affiliate.phone);
  const hasEmail = !isPlaceholder(affiliate.email);
  const hasAnyContact = hasAddress || hasPhone || hasEmail;
  const hasHistory = !isPlaceholder(affiliate.briefHistory);
  const hasServices = affiliate.services.length > 0;
  const hasChairperson = !isPlaceholder(affiliate.chapterPresident);
  const hasManager = !isPlaceholder(affiliate.chapterSupervisor);
  const hasBoardSize = affiliate.boardSize != null;
  const hasStaffCount = affiliate.staffCount != null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-2 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="font-semibold text-primary-900">
              {t("chapter_about_prefix")} {affiliate.name}
            </h3>
            {hasHistory && (
              <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                {affiliate.briefHistory}
              </p>
            )}
            {(affiliate.yearEstablished != null ||
              affiliate.totalMembers != null ||
              affiliate.branchCount != null) && (
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-gray-500">
                {affiliate.yearEstablished != null && (
                  <span>
                    {t("affiliate_year_founded_label")}: {affiliate.yearEstablished}
                  </span>
                )}
                {affiliate.totalMembers != null && (
                  <span>
                    {t("chapter_members_label")}: {affiliate.totalMembers}
                  </span>
                )}
                {affiliate.branchCount != null && (
                  <span>
                    {t("chapter_branches_label")}: {affiliate.branchCount}
                  </span>
                )}
              </div>
            )}
          </div>

          {hasServices && (
            <div>
              <h3 className="font-semibold text-primary-900 text-sm uppercase tracking-wide">
                {t("chapter_services_heading")}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {affiliate.services.map((service) => (
                  <Badge key={service} variant="primary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(hasChairperson || hasManager || hasBoardSize || hasStaffCount) && (
            <div>
              <h3 className="font-semibold text-primary-900 text-sm uppercase tracking-wide">
                {t("affiliate_leadership_heading")}
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-1 mt-2 text-sm text-gray-700">
                {hasChairperson && (
                  <span>
                    {t("affiliate_board_chairperson_label")}: {affiliate.chapterPresident}
                  </span>
                )}
                {hasManager && (
                  <span>
                    {t("affiliate_general_manager_label")}: {affiliate.chapterSupervisor}
                  </span>
                )}
                {hasBoardSize && (
                  <span>
                    {t("chapter_board_size_label")}: {affiliate.boardSize}
                  </span>
                )}
                {hasStaffCount && (
                  <span>
                    {t("chapter_staff_count_label")}: {affiliate.staffCount}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <h3 className="font-semibold text-primary-900 text-sm uppercase tracking-wide">
            {t("chapter_contact_heading")}
          </h3>
          <div className="mt-2 space-y-2 text-sm text-gray-700">
            {hasPhone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                <span>{affiliate.phone}</span>
              </div>
            )}
            {hasEmail && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                <span>{affiliate.email}</span>
              </div>
            )}
            {hasAddress && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                <span>{affiliate.address}</span>
              </div>
            )}
            {!hasAnyContact && (
              <p className="text-gray-500">{t("affiliates_profile_pending_message")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AffiliatesPageContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") ?? "";

  const [affiliates, setAffiliates] = useState<PublicAffiliateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  // Deep-linked from the homepage's reach band and a credit union's
  // chapter breadcrumb (e.g. /affiliates?region=NORTHWEST) — pre-selects
  // the matching chapter on first render.
  const [selectedChapter, setSelectedChapter] = useState(() =>
    regions.includes(regionParam) ? chapterLabel(regionParam, language) : ""
  );
  const [expandedAffiliate, setExpandedAffiliate] = useState<string | null>(null);

  // Re-applies the ?region= deep link if it changes via client-side
  // navigation while already on this page — adjusted during render since
  // it's reacting to a URL change, not an effect.
  const [lastRegionParam, setLastRegionParam] = useState(regionParam);
  if (regionParam !== lastRegionParam) {
    setLastRegionParam(regionParam);
    setSelectedChapter(regions.includes(regionParam) ? chapterLabel(regionParam, language) : "");
    setExpandedAffiliate(null);
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/affiliates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load affiliates");
        return res.json();
      })
      .then((data: { affiliates: PublicAffiliateProfile[] }) => {
        if (ignore) return;
        setAffiliates(data.affiliates);
        setIsLoading(false);
      })
      .catch(() => {
        if (!ignore) {
          setLoadError(true);
          setIsLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const chapterOptions = regions.map((region) => ({
    region,
    label: chapterLabel(region, language),
  }));

  const selectedRegion = chapterOptions.find((c) => c.label === selectedChapter)?.region ?? "";
  const filteredAffiliates = affiliates.filter((a) => a.region === selectedRegion);

  function selectChapter(label: string) {
    setSelectedChapter(label);
    setExpandedAffiliate(null);
  }

  function toggleAffiliate(code: string) {
    setExpandedAffiliate((prev) => (prev === code ? null : code));
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4">
        {selectedChapter === "" ? (
          <FadeUp>
          <Card className="p-8 text-center mx-auto max-w-lg">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">
              {t("affiliates_select_title")}
            </h2>
            <p className="text-gray-600 mb-6">{t("affiliates_select_description")}</p>
            <select
              value={selectedChapter}
              onChange={(e) => selectChapter(e.target.value)}
              className="w-full h-14 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none text-lg px-6 bg-white cursor-pointer"
            >
              <option value="" disabled className="text-gray-400">
                {t("affiliates_select_placeholder")}
              </option>
              {chapterOptions.map((c) => (
                <option key={c.region} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </Card>
          </FadeUp>
        ) : (
          <>
            <FadeUp>
            <Card className="p-6 mb-8 border-l-4 border-primary-500">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="font-display text-xl font-bold text-primary-900">
                    {t("affiliates_region_label")} {selectedChapter}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {t("affiliates_total_label")} {filteredAffiliates.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectChapter("")}
                  className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t("affiliates_change_region")}
                </button>
              </div>
            </Card>
            </FadeUp>

            {isLoading ? (
              <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
            ) : loadError ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                Could not load the credit union directory. Please refresh the page.
              </div>
            ) : filteredAffiliates.length > 0 ? (
              <div className="space-y-3">
                {filteredAffiliates.map((affiliate, index) => {
                  const isOpen = expandedAffiliate === affiliate.code;
                  return (
                    <FadeUp key={affiliate.id} index={index % 8}>
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleAffiliate(affiliate.code)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors text-left"
                        >
                          <Building2 className="h-5 w-5 text-primary-500 shrink-0" />
                          <span className="font-semibold text-primary-900 flex-1 min-w-0 truncate">
                            {affiliate.name}
                          </span>
                          <Badge variant="default" className="shrink-0">
                            {affiliate.code}
                          </Badge>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-gray-400 transition-transform shrink-0",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {isOpen && <AffiliateProfileDetails affiliate={affiliate} t={t} />}
                      </div>
                    </FadeUp>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">{t("affiliates_empty_title")}</p>
                <p className="text-gray-500 text-sm mt-1">{t("affiliates_empty_subtitle")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AffiliatesFallback() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="p-8 text-center mx-auto max-w-lg">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="h-14 rounded-xl border-2 border-gray-200 bg-gray-50 animate-pulse" />
        </Card>
      </div>
    </div>
  );
}

export default function AffiliatesPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("affiliates_page_title")}
        subtitle={t("affiliates_page_subtitle")}
        breadcrumb={[
          { label: t("nav_home"), href: "/" },
          { label: t("nav_affiliates"), href: "/affiliates" },
        ]}
      />

      <Suspense fallback={<AffiliatesFallback />}>
        <AffiliatesPageContent />
      </Suspense>
    </>
  );
}
