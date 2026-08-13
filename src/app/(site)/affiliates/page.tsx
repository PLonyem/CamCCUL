import { prisma } from "@/lib/prisma";
import { affiliates as mockAffiliates } from "@/lib/mock-data";
import { AffiliatesPageClient, type PublicAffiliate } from "./AffiliatesPageClient";

async function getActiveAffiliates(): Promise<PublicAffiliate[]> {
  try {
    const affiliates = await prisma.affiliate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        region: true,
        city: true,
        profileUpdatedAt: true,
      },
    });
    return affiliates.map((a) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      region: a.region,
      city: a.city,
      hasProfile: a.profileUpdatedAt != null,
    }));
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock affiliate data:",
      error
    );
    // Mock affiliates have no profileUpdatedAt equivalent — none of them
    // has ever had a chapter profile submitted, so this fallback path
    // always reports "Profile Pending".
    return mockAffiliates
      .filter((a) => a.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((a) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        region: a.region,
        city: a.city,
        hasProfile: false,
      }));
  }
}

export default async function AffiliatesPage() {
  const affiliates = await getActiveAffiliates();
  return <AffiliatesPageClient affiliates={affiliates} />;
}
