import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { hashValue } from "../src/util/bcrypt";
import content from "content";
import sortWord from "../src/util/sortWord";
import { richContentSchema } from "@/schemas/richContent";
import { Profile } from "@/generated/prisma/browser";

const prismaClient = new PrismaClient();

async function main() {
  const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_API_SLUG } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD || !ADMIN_API_SLUG) return;

  const profile = await prismaClient.profile.upsert({
    where: { email: process.env.ADMIN_USER },
    update: {
      password: await hashValue(process.env.ADMIN_PASSWORD as string),
    },
    create: {
      email: process.env.ADMIN_USER as string,
      password: await hashValue(process.env.ADMIN_PASSWORD as string),
    },
    include: {
      items: true,
      feeds: true,
      apiKeys: true,
    },
  });

  if (!profile.apiKeys.length) {
    const apiKeyValue = randomUUID();
    await prismaClient.apiKey.upsert({
      where: { profileId: profile.id, slug: ADMIN_API_SLUG },
      update: {},
      create: {
        profileId: profile.id,
        slug: ADMIN_API_SLUG,
        value: apiKeyValue,
      },
    });
    // how do I get this on remote server?
    console.log(`Admin API key value: ${apiKeyValue}`);
  }

  await handleDeletes(profile.id);
  await handleLibraryUpserts();
  await handleAdminBaseContentUpserts(profile);
}

async function handleDeletes(profileId: number) {
  for (const path of content.deletes.feeds) {
    await prismaClient.feed.deleteMany({
      where: { path, profileId },
    });
  }
  for (const slug of content.deletes.items) {
    await prismaClient.item.deleteMany({
      where: { slug, profileId },
    });
  }
  for (const name of content.deletes.componentTypes) {
    await prismaClient.componentType.deleteMany({
      where: { name },
    });
  }
  for (const url of content.deletes.images) {
    await prismaClient.image.deleteMany({
      where: { url },
    });
  }
  for (const name of content.deletes.tags) {
    await prismaClient.tag.deleteMany({
      where: { name },
    });
  }
}

async function handleLibraryUpserts() {
  for (const tag of content.upserts.tags) {
    await prismaClient.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
      },
    });
  }
  for (const image of content.upserts.images) {
    await prismaClient.image.upsert({
      where: { url: image.url },
      update: {
        alt: image.alt,
        type: image.type,
      },
      create: {
        url: image.url,
        alt: image.alt,
        type: image.type,
      },
    });
  }
  for (const componentType of content.upserts.componentTypes) {
    await prismaClient.componentType.upsert({
      where: { name: componentType.name },
      update: {
        subjectType: componentType.subjectType,
        propertySchema: componentType.propertySchema as Prisma.InputJsonValue,
      },
      create: {
        name: componentType.name,
        subjectType: componentType.subjectType,
        propertySchema: componentType.propertySchema as Prisma.InputJsonValue,
      },
    });
  }
}

async function handleAdminBaseContentUpserts(profile: Profile) {
  // items first
  for (const item of content.upserts.items) {
    const {
      // relations
      tags: tagNames,
      images: imageUrls,
      dateRanges,
      // properties
      slug,
      name,
      description,
      richContent,
      overrideLink,
    } = item;

    const validatedContent = richContentSchema.parse(richContent);

    await prismaClient.$transaction(async (tx) => {
      const newTagsIds =
        (
          await prismaClient.tag.findMany({
            where: { name: { in: tagNames } },
          })
        ).map((tag: { id: number }) => tag.id) || [];
      const newImagesIds =
        (
          await prismaClient.image.findMany({
            where: { url: { in: imageUrls } },
          })
        ).map((image: { id: number }) => image.id) || [];
      const newDateRanges =
        dateRanges?.map((dr) => {
          return {
            ...dr,
            startAt: new Date(dr.startAt),
            endAt: new Date(dr.endAt),
          };
        }) || [];

      // maybe diff the new ids with existing ones before update
      await prismaClient.item.upsert({
        where: { authorId: profile.id, slug },
        update: {
          name,
          // do not update slug, its used to persist the item every seed
          sortName: sortWord(name),
          description,
          richContent: validatedContent as Prisma.InputJsonValue,
          authorId: profile.id,
          isPrivate: !!item.isPrivate,
          overrideLink,
          publishedAt: new Date(),
          // tags have a unique name
          tags: {
            deleteMany: {},
            create: newTagsIds.map((id: number) => ({ tagId: id })),
          },
          // images have a unique url
          images: {
            deleteMany: {},
            create: newImagesIds.map((id: number) => ({
              imageId: id,
            })),
          },
          // dateRanges have been given a unique slug
          dateRanges: {
            deleteMany: {},
            create: newDateRanges,
          },
        },
        create: {
          name,
          slug,
          sortName: sortWord(name),
          description,
          richContent: validatedContent as Prisma.InputJsonValue,
          authorId: profile.id,
          isPrivate: !!item.isPrivate,
          overrideLink,
          publishedAt: new Date(),
          tags: {
            create: newTagsIds.map((id: number) => ({ tagId: id })),
          },
          images: {
            create: newImagesIds.map((id: number) => ({
              imageId: id,
            })),
          },
          dateRanges: {
            create: newDateRanges,
          },
        },
      });
    });
  }

  // then feeds
  for (const feed of content.upserts.feeds) {
    await prismaClient.$transaction(async (tx) => {
      const upsertedFeed = await tx.feed.upsert({
        where: {
          profileId_path_subjectType: {
            profileId: profile.id,
            path: feed.path,
            subjectType: feed.subjectType,
          },
        },
        update: {},
        create: {
          profileId: profile.id,
          path: feed.path,
          subjectType: feed.subjectType,
        },
      });

      // Build a map of typeName -> typeId for all component types in this feed
      const typeNames = feed.components.map((c) => c.typeName);
      const componentTypes = await tx.componentType.findMany({
        where: { name: { in: typeNames } },
      });
      const typeMap = Object.fromEntries(
        componentTypes.map((ct) => [ct.name, ct.id]),
      );

      // Delete and recreate components to avoid conflicts with the
      // @@unique([feedId, order]) constraint when reordering
      await tx.component.deleteMany({ where: { feedId: upsertedFeed.id } });

      for (const [index, component] of feed.components.entries()) {
        const typeId = typeMap[component.typeName];
        if (!typeId) {
          console.warn(
            `ComponentType "${component.typeName}" not found, skipping "${component.name}"`,
          );
          continue;
        }
        await tx.component.create({
          data: {
            name: component.name,
            typeName: component.typeName,
            typeId,
            feedId: upsertedFeed.id,
            order: index + 1,
            propertyValues: (component.propertyValues ??
              {}) as Prisma.InputJsonValue,
          },
        });
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
