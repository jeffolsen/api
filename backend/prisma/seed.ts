import "dotenv/config";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { hashValue } from "../src/util/bcrypt";
import content from "content";
import sortWord from "../src/util/sortWord";
import { richContentSchema } from "@/schemas/richContent";
import { Profile } from "@/generated/prisma/browser";

const prismaClient = new PrismaClient();

async function main() {
  const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USER || !ADMIN_PASSWORD) return;

  const profile = await prismaClient.profile.upsert({
    where: { email: process.env.ADMIN_USER },
    update: {
      password: await hashValue(process.env.ADMIN_PASSWORD as string),
      profileReceipt: {
        upsert: {
          update: {},
          create: {
            consentToTermsAt: new Date(),
            consentToPrivacyAt: new Date(),
            verifiedAgeAt: new Date(),
            verifiedEmailAt: new Date(),
          },
        },
      },
    },
    create: {
      email: process.env.ADMIN_USER as string,
      password: await hashValue(process.env.ADMIN_PASSWORD as string),
      profileReceipt: {
        create: {
          consentToTermsAt: new Date(),
          consentToPrivacyAt: new Date(),
          verifiedAgeAt: new Date(),
          verifiedEmailAt: new Date(),
        },
      },
    },
    include: {
      items: true,
      feeds: true,
      apiKeys: true,
    },
  });
  await handleCreateApiKeys(profile.id);
  await handleDeletes(profile.id);
  await handleLibraryUpserts();
  await handleAdminBaseContentUpserts(profile);
}

async function handleCreateApiKeys(profileId: number) {
  const {
    PROD_API_KEY,
    PROD_API_SLUG,
    DEV_API_KEY,
    DEV_API_SLUG,
    DEV_API_ORIGIN,
  } = process.env;

  if (!!PROD_API_KEY && !!PROD_API_SLUG) {
    await prismaClient.apiKey.upsert({
      where: { profileId, slug: PROD_API_SLUG as string },
      update: {
        value: PROD_API_KEY as string,
        origin: null, // see env
      },
      create: {
        profileId,
        slug: PROD_API_SLUG as string,
        value: PROD_API_KEY as string,
      },
    });
  }
  if (!!DEV_API_KEY && !!DEV_API_SLUG && !!DEV_API_ORIGIN) {
    await prismaClient.apiKey.upsert({
      where: { profileId, slug: DEV_API_SLUG as string },
      update: {
        value: DEV_API_KEY as string,
        origin: DEV_API_ORIGIN as string,
      },
      create: {
        profileId,
        slug: DEV_API_SLUG as string,
        value: DEV_API_KEY as string,
        origin: DEV_API_ORIGIN as string,
      },
    });
  }
}

async function handleDeletes(profileId: number) {
  for (const feed of content.deletes.feeds) {
    const { path, subjectType } = feed;
    await prismaClient.feed.deleteMany({
      where: { path, subjectType, profileId },
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
    const {
      // relations
      path,
      subjectType,
      seoTitle,
      seoDescription,
      seoImage,
      schemaType,
      links,
      tags: tagNames,
    } = feed;
    const newTagsIds =
      (tagNames &&
        (
          await prismaClient.tag.findMany({
            where: { name: { in: tagNames } },
          })
        ).map((tag: { id: number }) => tag.id)) ||
      [];
    const newLinks = links || [];

    await prismaClient.$transaction(async (tx) => {
      const upsertedFeed = await tx.feed.upsert({
        where: {
          profileId_path_subjectType: {
            profileId: profile.id,
            path: feed.path,
            subjectType: feed.subjectType,
          },
        },
        update: {
          ...(seoTitle && { seoTitle }),
          ...(seoDescription && { seoDescription }),
          ...(seoImage && { seoImage }),
          ...(schemaType && { schemaType }),
          tags: {
            deleteMany: {},
            create: newTagsIds.map((id: number) => ({ tagId: id })),
          },
        },
        create: {
          profileId: profile.id,
          path,
          subjectType,
          ...(seoTitle && { seoTitle }),
          ...(seoDescription && { seoDescription }),
          ...(seoImage && { seoImage }),
          ...(schemaType && { schemaType }),
          tags: {
            create: newTagsIds.map((id: number) => ({ tagId: id })),
          },
        },
      });

      // Delete existing FeedLinks and their owned Links
      const existingFeedLinks = await tx.feedLink.findMany({
        where: { feedId: upsertedFeed.id },
      });
      const existingLinkIds = existingFeedLinks.map((fl) => fl.linkId);
      await tx.feedLink.deleteMany({ where: { feedId: upsertedFeed.id } });
      if (existingLinkIds.length) {
        await tx.link.deleteMany({ where: { id: { in: existingLinkIds } } });
      }
      // then recreate
      for (const linkData of newLinks) {
        const link = await tx.link.create({ data: linkData });
        await tx.feedLink.create({
          data: { feedId: upsertedFeed.id, linkId: link.id },
        });
      }

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
