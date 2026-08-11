import { prisma } from "@/lib/prisma";
import { resources as mockResources } from "@/lib/mock-data";
import { ResourcesPageClient, type PublicResource } from "./ResourcesPageClient";

async function getActiveResources(): Promise<PublicResource[]> {
  try {
    return await prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        fileType: true,
      },
    });
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock resource data:",
      error
    );
    // Mock resource titles/descriptions are bilingual objects; the real
    // schema only has a single string field, so English is used here to
    // match how these were originally seeded.
    return [...mockResources]
      .map((r) => ({
        id: r.id,
        title: r.title.en,
        description: r.description.en,
        category: r.category,
        fileType: r.fileType,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}

export default async function ResourcesPage() {
  const resources = await getActiveResources();
  return <ResourcesPageClient resources={resources} />;
}
