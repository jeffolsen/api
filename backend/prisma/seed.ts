import prismaClient, { TagName } from "../src/db/client";

async function main() {
  const seedTag = async (name: TagName) => {
    await prismaClient.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  };
  console.log("seeding tags");
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
