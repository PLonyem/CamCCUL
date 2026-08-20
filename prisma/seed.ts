import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { affiliates, newsArticles, resources } from "../src/lib/mock-data";

async function seedAdminUser() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@camccul.cm" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@camccul.cm",
      passwordHash,
      role: "admin",
    },
  });
  console.log("Admin user seeded");
}

async function seedNewsArticles() {
  for (const article of newsArticles) {
    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        language: article.language,
        category: article.category,
        tags: article.tags,
        excerpt: article.excerpt,
        content: article.content,
        authorName: article.author.name,
        authorRole: article.author.role || null,
        chapter: article.chapter || null,
        featured: article.featured,
        published: true,
        publishedAt: new Date(article.publishedAt),
        heroImageUrl: article.heroImage.url || null,
        heroImageAlt: article.heroImage.alt || null,
        heroImageCaption: article.heroImage.caption || null,
      },
    });
  }
  console.log(`${newsArticles.length} news articles seeded`);
}

async function seedAffiliates() {
  for (const affiliate of affiliates) {
    await prisma.affiliate.upsert({
      where: { code: affiliate.code },
      update: {},
      create: {
        code: affiliate.code,
        name: affiliate.name,
        region: affiliate.region,
        city: affiliate.city || null,
        address: affiliate.address || null,
        phone: affiliate.phone || null,
        email: affiliate.email || null,
        isActive: affiliate.isActive,
      },
    });
  }
  console.log(`${affiliates.length} affiliates seeded`);
}

async function seedResources() {
  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: {
        id: resource.id,
        title: resource.title.en,
        description: resource.description.en,
        category: resource.category,
        fileType: resource.fileType,
        fileSize: resource.fileSize,
        downloadCount: resource.downloadCount,
        fileUrl: resource.fileUrl || null,
      },
    });
  }
  console.log(`${resources.length} resources seeded`);
}

async function seedContactMessages() {
  const sampleMessages = [
    {
      id: "contact-msg-1",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      subject: "Question about opening a savings account",
      message:
        "Hello, I'd like to know the requirements for opening a savings account through one of your affiliate credit unions in the Northwest region. Thank you.",
    },
    {
      id: "contact-msg-2",
      name: "John Smith",
      email: "john.smith@example.com",
      subject: "Loan application inquiry",
      message:
        "Good day, I submitted a loan application through my local credit union two weeks ago and haven't heard back. Could someone advise on the typical processing time?",
    },
    {
      id: "contact-msg-3",
      name: "Grace Mbah",
      email: "grace.mbah@example.com",
      subject: "Partnership proposal",
      message:
        "Hello CamCCUL team, I represent a local NGO interested in exploring a financial literacy partnership with your network. Please let me know who I should speak with.",
    },
  ];

  for (const sample of sampleMessages) {
    await prisma.contactMessage.upsert({
      where: { id: sample.id },
      update: {},
      create: sample,
    });
  }
  console.log(`${sampleMessages.length} sample contact messages seeded`);
}

// HomepageContent, SiteSettings, and NotificationSettings each have no
// natural unique business key (no email/slug/code) since they're meant to
// exist as a single row — "default" is a fixed, well-known id so this stays
// idempotent and the app has a predictable id to query later, same idea as
// seedContactMessages' fixed sample ids above.
async function seedHomepageContent() {
  await prisma.homepageContent.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  console.log("Homepage content seeded");
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  console.log("Site settings seeded");
}

async function seedNotificationSettings() {
  await prisma.notificationSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  console.log("Notification settings seeded");
}

async function main() {
  await seedAdminUser();
  await seedNewsArticles();
  await seedAffiliates();
  await seedResources();
  await seedContactMessages();
  await seedHomepageContent();
  await seedSiteSettings();
  await seedNotificationSettings();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
