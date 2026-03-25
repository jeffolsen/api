import prismaClient, { ImageType } from "../src/db/client";
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
      update: {},
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
      update: {},
      create: {
        name: componentType.name,
        itemBinding: componentType.itemBinding,
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
