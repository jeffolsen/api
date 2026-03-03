import prismaClient, { TagName, ImageType } from "../src/db/client";
import content from "content";

async function main() {
  content.images.forEach(async (image) => {
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
  const seedTag = async (name: TagName) => {
    await prismaClient.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  };
  Object.keys(TagName).forEach((t) => {
    seedTag(t as TagName);
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
