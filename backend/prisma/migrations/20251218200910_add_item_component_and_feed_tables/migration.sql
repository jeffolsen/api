-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('BASIC_BLOCK');

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';

-- CreateTable
CREATE TABLE "feeds" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "type" "ComponentType" NOT NULL DEFAULT 'BASIC_BLOCK',
    "title" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "feedId" INTEGER,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
