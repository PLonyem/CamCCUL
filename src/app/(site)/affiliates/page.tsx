import { prisma } from "@/lib/prisma";
import { affiliates as mockAffiliates } from "@/lib/mock-data";
import { AffiliatesPageClient, type PublicAffiliate } from "./AffiliatesPageClient";

async function getActiveAffiliates(): Promise<PublicAffiliate[]> {
  try {
    return await prisma.affiliate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        region: true,
        city: true,
        phone: true,
        email: true,
      },
    });
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock affiliate data:",
      error
    );
    return mockAffiliates
      .filter((a) => a.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((a) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        region: a.region,
        city: a.city,
        phone: a.phone,
        email: a.email,
      }));
  }
}

export default async function AffiliatesPage() {
  const affiliates = await getActiveAffiliates();
  return <AffiliatesPageClient affiliates={affiliates} />;
}
