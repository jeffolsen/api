import "dotenv/config";
import prismaClient, { ImageType, Prisma, SubjectType } from "../src/db/client";
import { passwordTransform } from "../src/schemas/profile";
import content from "content";
import sortWord from "../src/util/sortWord";

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
        type: image.type as ImageType,
      },
      create: {
        url: image.url,
        alt: image.alt,
        type: image.type as ImageType,
      },
    });
  }
  for (const componentType of content.upserts.componentTypes) {
    await prismaClient.componentType.upsert({
      where: { name: componentType.name },
      update: {
        subjectType: componentType.subjectType as SubjectType,
        propertySchema: componentType.propertySchema as Prisma.InputJsonValue,
      },
      create: {
        name: componentType.name,
        subjectType: componentType.subjectType as SubjectType,
        propertySchema: componentType.propertySchema as Prisma.InputJsonValue,
      },
    });
  }

  const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_API_SLUG, ADMIN_API_ORIGIN } =
    process.env;
  if (
    !!ADMIN_USER &&
    !!ADMIN_PASSWORD &&
    !!ADMIN_API_SLUG &&
    !!ADMIN_API_ORIGIN
  ) {
    const profile = await prismaClient.profile.upsert({
      where: { email: process.env.ADMIN_USER },
      update: {
        password: await passwordTransform.parseAsync(
          process.env.ADMIN_PASSWORD,
        ),
      },
      create: {
        email: process.env.ADMIN_USER as string,
        password: await passwordTransform.parseAsync(
          process.env.ADMIN_PASSWORD,
        ),
      },
      include: { items: true },
    });
    const apiKeyValue = prismaClient.apiKey.generateKeyValue();
    const apiKey = await prismaClient.apiKey.upsert({
      where: { profileId: profile.id, slug: ADMIN_API_SLUG },
      update: {},
      create: {
        profileId: profile.id,
        slug: ADMIN_API_SLUG,
        origin: ADMIN_API_ORIGIN as string,
        value: apiKeyValue,
      },
    });
    console.log(`Admin API key value: ${apiKeyValue}`);

    if (profile.items.length < 10) {
      for (const item of content.upserts.items ?? []) {
        const { tags: tagNames, images: imageUrls, name, description } = item;
        const tags = await prismaClient.tag.findMany({
          where: { name: { in: tagNames } },
        });
        const images = await prismaClient.image.findMany({
          where: { url: { in: imageUrls } },
        });
        await prismaClient.item.create({
          data: {
            name,
            sortName: sortWord(name),
            description,
            authorId: profile.id,
            isPrivate: false,
            publishedAt: new Date(),
            tags: {
              create: tags.map(({ id }) => ({ tagId: id })),
            },
            images: {
              create: images.map(({ id }) => ({ imageId: id })),
            },
          },
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
