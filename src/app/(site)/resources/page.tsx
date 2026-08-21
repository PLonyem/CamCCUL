import { prisma } from "@/lib/prisma";
import { resources as mockResources } from "@/lib/mock-data";
import { isPlaceholder } from "@/lib/utils";
import { ResourcesPageClient, type PublicResource } from "./ResourcesPageClient";

// Ships with the codebase (the printable form at /resources/chapter-profile-
// template) rather than being admin-managed CMS content, so it's merged in
// here unconditionally instead of depending on a database row that would
// need seeding into the live database.
const CHAPTER_PROFILE_TEMPLATE_RESOURCE: PublicResource = {
  id: "res-chapter-profile-template",
  title: "Credit Union Profile Form",
  description:
    "Download and complete this form to update your credit union's profile on the CamCCUL website. Once submitted, your information will appear when visitors click on your credit union on the Find a Credit Union page.",
  category: "Form",
  fileType: "PDF",
  fileUrl: "/api/resources/chapter-profile-template",
};

async function getActiveResources(): Promise<PublicResource[]> {
  try {
    const resources = await prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        fileType: true,
        fileUrl: true,
      },
    });
    // The seed script copied mock-data.ts's placeholder resources straight
    // into the database, so even the "real" query path can still return
    // "[Document Title — to be provided by CamCCUL]" rows.
    return resources.filter((r) => !isPlaceholder(r.title));
  } catch (error) {
    console.error(
      "Database unavailable, falling back to mock resource data:",
      error
    );
    // Mock resource titles/descriptions are bilingual objects; the real
    // schema only has a single string field, so English is used here to
    // match how these were originally seeded.
    return [...mockResources]
      .filter((r) => !isPlaceholder(r.title.en))
      .map((r) => ({
        id: r.id,
        title: r.title.en,
        description: r.description.en,
        category: r.category,
        fileType: r.fileType,
        fileUrl: r.fileUrl ?? null,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}

export default async function ResourcesPage() {
  const resources = await getActiveResources();
  const withTemplate = resources.some(
    (r) => r.id === CHAPTER_PROFILE_TEMPLATE_RESOURCE.id
  )
    ? resources
    : [...resources, CHAPTER_PROFILE_TEMPLATE_RESOURCE];
  return <ResourcesPageClient resources={withTemplate} />;
}
