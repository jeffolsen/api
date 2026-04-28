import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { hashValue } from "../src/util/bcrypt";
import content from "content";
import sortWord from "../src/util/sortWord";

const prismaClient = new PrismaClient();

async function main() {
  for (const name of content.deletes.tags) {
    await prismaClient.tag.deleteMany({
      where: { name },
    });
  }
  for (const url of content.deletes.images) {
    await prismaClient.image.deleteMany({
      where: { url },
    });
  }
  for (const name of content.deletes.componentTypes) {
    await prismaClient.componentType.deleteMany({
      where: { name },
    });
  }
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

  const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_API_SLUG } = process.env;
  if (!!ADMIN_USER && !!ADMIN_PASSWORD && !!ADMIN_API_SLUG) {
    // get the profile and all items with a slug that matches the content slugs
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
        items: {
          where: {
            slug: { in: content.upserts.items?.map(({ slug }) => slug) },
          },
        },
      },
    });
    const apiKeyValue = randomUUID();
    await prismaClient.apiKey.upsert({
      where: { profileId: profile.id, slug: ADMIN_API_SLUG },
      update: {
        origin: null,
      },
      create: {
        profileId: profile.id,
        slug: ADMIN_API_SLUG,
        value: apiKeyValue,
      },
    });
    console.log(`Admin API key value: ${apiKeyValue}`);

    if (profile.items.length < content.upserts.items?.length) {
      for (const item of content.upserts.items) {
        const {
          tags: tagNames,
          images: imageUrls,
          name,
          description,
          slug,
        } = item;

        await prismaClient.$transaction(async (tx) => {
          const newTagsIds = (
            await prismaClient.tag.findMany({
              where: { name: { in: tagNames } },
            })
          ).map((tag: { id: number }) => tag.id);
          const newImagesIds = (
            await prismaClient.image.findMany({
              where: { url: { in: imageUrls } },
            })
          ).map((image: { id: number }) => image.id);

          // maybe diff the new ids with existing ones before update
          await prismaClient.item.upsert({
            where: { authorId: profile.id, slug },
            update: {
              name,
              sortName: sortWord(name),
              description,
              authorId: profile.id,
              isPrivate: !!item.isPrivate,
              publishedAt: new Date(),
              tags: {
                deleteMany: {},
                create: newTagsIds.map((id: number) => ({ tagId: id })),
              },
              images: {
                deleteMany: {},
                create: newImagesIds.map((id: number) => ({
                  imageId: id,
                })),
              },
            },
            create: {
              name,
              sortName: sortWord(name),
              description,
              authorId: profile.id,
              isPrivate: !!item.isPrivate,
              slug: slug,
              publishedAt: new Date(),
              tags: {
                create: newTagsIds.map((id: number) => ({ tagId: id })),
              },
              images: {
                create: newImagesIds.map((id: number) => ({
                  imageId: id,
                })),
              },
            },
          });
        });
      }
    }
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
