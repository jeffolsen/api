import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";
import sitemapConfig from "./sitemap.config";

const prisma = new PrismaClient();

const BASE_URL = process.env.ALLOWED_ORIGIN;
const ADMIN_EMAIL = process.env.ADMIN_USER;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function xmlComment(text: string): string {
  return `<!-- ${text} -->`;
}

function xmlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: number,
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

async function main() {
  if (!BASE_URL || !ADMIN_EMAIL) {
    console.error("ALLOWED_ORIGIN and ADMIN_USER must be set in .env");
    process.exit(1);
  }

  const admin = await prisma.profile.findFirst({
    where: { email: ADMIN_EMAIL },
  });

  if (!admin) {
    console.error(`Admin profile not found for ${ADMIN_EMAIL}`);
    process.exit(1);
  }

  const today = formatDate(new Date());
  const entries: string[] = [];
  const staticPaths = sitemapConfig.staticRoutes.map((r) => r.path);

  // Static routes
  entries.push(xmlComment("Static routes"));
  for (const route of sitemapConfig.staticRoutes) {
    entries.push(
      xmlEntry(
        `${BASE_URL}/${route.path}`,
        today,
        route.changefreq,
        route.priority,
      ),
    );
  }

  // Published COLLECTION feeds
  entries.push(xmlComment("Collection routes"));
  const collectionFeeds = await prisma.feed.findMany({
    where: {
      profileId: admin.id,
      subjectType: "COLLECTION",
      publishedAt: { not: null },
      path: { notIn: staticPaths },
    },
    select: { path: true, updatedAt: true },
  });

  const { collectionFeed, singleItem } = sitemapConfig.defaults;

  for (const feed of collectionFeeds) {
    entries.push(
      xmlEntry(
        `${BASE_URL}/${feed.path}`,
        formatDate(feed.updatedAt),
        collectionFeed.changefreq,
        collectionFeed.priority,
      ),
    );
  }

  // Published SINGLE feeds — items gated by tag overlap
  entries.push(xmlComment("Single item routes"));
  const singleFeeds = await prisma.feed.findMany({
    where: {
      profileId: admin.id,
      subjectType: "SINGLE",
      publishedAt: { not: null },
      path: { notIn: staticPaths },
    },
    include: { tags: true },
  });

  for (const feed of singleFeeds) {
    const feedTagIds = feed.tags.map((ft) => ft.tagId);
    if (!feedTagIds.length) continue;

    const items = await prisma.item.findMany({
      where: {
        authorId: admin.id,
        publishedAt: { not: null },
        tags: { some: { tagId: { in: feedTagIds } } },
      },
      select: { slug: true, updatedAt: true },
    });

    for (const item of items) {
      entries.push(
        xmlEntry(
          `${BASE_URL}/${feed.path}/${item.slug}`,
          formatDate(item.updatedAt),
          singleItem.changefreq,
          singleItem.priority,
        ),
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  const outputPath = join(__dirname, "../../frontend/public/sitemap.xml");
  writeFileSync(outputPath, xml, "utf-8");
  console.log(
    `Sitemap written to ${outputPath} — ${entries.length} URL${entries.length === 1 ? "" : "s"}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
