import prismaClient, { ImageType, Prisma, SubjectType } from "../src/db/client";
import content from "content";

async function main() {
  content.deletes.tags.forEach(async (name) => {
    await prismaClient.tag.deleteMany({
      where: { name },
    });
  });
  content.deletes.images.forEach(async (url) => {
    await prismaClient.image.deleteMany({
      where: { url },
    });
  });
  content.deletes.componentTypes.forEach(async (name) => {
    await prismaClient.componentType.deleteMany({
      where: { name },
    });
  });
  content.upserts.tags.forEach(async (tag) => {
    await prismaClient.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
      },
    });
  });
  content.upserts.images.forEach(async (image) => {
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
  });
  content.upserts.componentTypes.forEach(async (componentType) => {
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
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
