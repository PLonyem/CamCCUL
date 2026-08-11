"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, MapPin, Phone, SearchX } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { regions, regionLabels } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";
import { localize } from "@/lib/i18n";

export interface PublicAffiliate {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string | null;
}

function RegionSelectCard({
  selectedRegion,
  onChange,
  disabled,
}: {
  selectedRegion: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  const { t, language } = useLanguage();

  return (
    <Card className="p-8 text-center mx-auto max-w-lg">
      <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">
        {t("affiliates_select_title")}
      </h2>
      <p className="text-gray-600 mb-6">
        {t("affiliates_select_description")}
      </p>
      <select
        value={selectedRegion}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-14 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none text-lg px-6 bg-white cursor-pointer"
      >
        <option value="" disabled className="text-gray-400">
          {t("affiliates_select_placeholder")}
        </option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {localize(regionLabels[region], language)}
          </option>
        ))}
      </select>
    </Card>
  );
}

function AffiliatesContent({ affiliates }: { affiliates: PublicAffiliate[] }) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") ?? "";
  const [selectedRegion, setSelectedRegion] = useState(
    regions.includes(regionParam) ? regionParam : ""
  );

  // Syncs state when the URL's `region` param changes via client-side
  // navigation (e.g. the Navbar dropdown) — adjusted during render (rather
  // than in an effect) since it's reacting to a change in the URL param.
  const [lastRegionParam, setLastRegionParam] = useState(regionParam);
  if (regionParam !== lastRegionParam) {
    setLastRegionParam(regionParam);
    setSelectedRegion(regions.includes(regionParam) ? regionParam : "");
  }

  const filteredAffiliates = affiliates.filter(
    (affiliate) => affiliate.region === selectedRegion
  );

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4">
        {selectedRegion === "" ? (
          <RegionSelectCard
            selectedRegion={selectedRegion}
            onChange={setSelectedRegion}
          />
        ) : (
          <>
            <Card className="p-6 mb-8 border-l-4 border-primary-500">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="font-display text-xl font-bold text-primary-900">
                    {t("affiliates_region_label")} {localize(regionLabels[selectedRegion], language)}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {t("affiliates_total_label")} {filteredAffiliates.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRegion("")}
                  className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t("affiliates_change_region")}
                </button>
              </div>
            </Card>

            {filteredAffiliates.length > 0 ? (
              <div>
                {filteredAffiliates.map((affiliate) => (
                  <div
                    key={affiliate.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 mb-3 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <Building2 className="h-5 w-5 text-primary-500 inline mr-2" />
                      <span className="font-semibold text-lg text-primary-900">
                        {affiliate.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2 bg-gray-100 rounded px-2 py-0.5">
                        {affiliate.code}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                      <span>
                        <MapPin className="h-3.5 w-3.5 inline mr-1" />
                        {affiliate.city}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {t("affiliates_contact_hq_note")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {t("affiliates_empty_title")}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {t("affiliates_empty_subtitle")}
                </p>
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
        <RegionSelectCard selectedRegion="" disabled />
      </div>
    </div>
  );
}

export function AffiliatesPageClient({ affiliates }: { affiliates: PublicAffiliate[] }) {
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
        <AffiliatesContent affiliates={affiliates} />
      </Suspense>
    </>
  );
}
