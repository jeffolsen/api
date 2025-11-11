// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create or update a user named Alice
  const test = await prisma.profile.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      password: "testword",
    },
  });

  console.log(`Seeded users: ${test.email}`);
}

main()
  .catch((e) => {
    console.log("FAILED");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("DISCONNECTING");
    await prisma.$disconnect();
  });
