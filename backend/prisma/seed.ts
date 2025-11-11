import prismaClient from "../src/db/client";

async function main() {
  const test = await prismaClient.profile.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      password: "testword",
    },
  });

  console.log(`Seeded profile: ${test.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
