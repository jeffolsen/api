/*
  Warnings:

  - Changed the type of `name` on the `tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TagName" AS ENUM ('PERSON', 'PLACE', 'THING', 'PAST', 'PRESENT', 'FUTURE', 'RED', 'BLUE', 'GREEN', 'FOO', 'BAR', 'BAZ');

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "name",
ADD COLUMN     "name" "TagName" NOT NULL;

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
