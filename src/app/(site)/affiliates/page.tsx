"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, MapPin, Phone, Mail, SearchX } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/Card";
import { affiliates, regions } from "@/lib/mock-data";

function RegionSelectCard({
  selectedRegion,
  onChange,
  disabled,
}: {
  selectedRegion: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Card className="p-8 text-center mx-auto max-w-lg">
      <Building2 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-primary-900 dark:text-white mb-2">
        Find Credit Unions in Your Region
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Select a region from the dropdown below to view all affiliated
        credit unions in that area.
      </p>
      <select
        value={selectedRegion}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-14 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none text-lg px-6 bg-white dark:bg-gray-800 dark:text-white cursor-pointer"
      >
        <option value="" disabled className="text-gray-400 dark:text-gray-500">
          — Select a Region —
        </option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </Card>
  );
}

function AffiliatesContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") ?? "";
  const [selectedRegion, setSelectedRegion] = useState(
    regions.includes(regionParam) ? regionParam : ""
  );

  // Syncs state when the URL's `region` param changes via client-side
  // navigation (e.g. the Navbar dropdown) — a route that stays mounted on
  // the same page doesn't re-run useState's initializer on its own.
  useEffect(() => {
    setSelectedRegion(regions.includes(regionParam) ? regionParam : "");
  }, [regionParam]);

  const filteredAffiliates = affiliates.filter(
    (affiliate) => affiliate.region === selectedRegion
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
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
                  <p className="font-display text-xl font-bold text-primary-900 dark:text-white">
                    Region: {selectedRegion}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Total Credit Unions: {filteredAffiliates.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRegion("")}
                  className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Change Region
                </button>
              </div>
            </Card>

            {filteredAffiliates.length > 0 ? (
              <div>
                {filteredAffiliates.map((affiliate) => (
                  <div
                    key={affiliate.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-3 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <Building2 className="h-5 w-5 text-primary-500 inline mr-2" />
                      <span className="font-semibold text-lg text-primary-900 dark:text-white">
                        {affiliate.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5">
                        {affiliate.code}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <span>
                        <MapPin className="h-3.5 w-3.5 inline mr-1" />
                        {affiliate.city}
                      </span>
                      <span>
                        <Phone className="h-3.5 w-3.5 inline mr-1" />
                        {affiliate.phone}
                      </span>
                      <span className="text-accent-600 dark:text-accent-400">
                        <Mail className="h-3.5 w-3.5 inline mr-1" />
                        {affiliate.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchX className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No credit unions found in this region.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Please select a different region.
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4">
        <RegionSelectCard selectedRegion="" disabled />
      </div>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <>
      <PageHero
        title="Our Affiliate Credit Unions"
        subtitle="Select a region to view its affiliated credit unions"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Affiliates", href: "/affiliates" },
        ]}
      />

      <Suspense fallback={<AffiliatesFallback />}>
        <AffiliatesContent />
      </Suspense>
    </>
  );
}
