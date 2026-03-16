/*
  Warnings:

  - You are about to drop the column `endAt` on the `date_ranges` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `date_ranges` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `feeds` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `items` table. All the data in the column will be lost.
  - Added the required column `end_at` to the `date_ranges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `date_ranges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `feeds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_profileId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_authorId_fkey";

-- DropIndex
DROP INDEX "api_keys_profile_id_key";

-- AlterTable
ALTER TABLE "date_ranges" DROP COLUMN "endAt",
DROP COLUMN "startAt",
ADD COLUMN     "end_at" TIMESTAMPTZ(3) NOT NULL,
ADD COLUMN     "start_at" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "feeds" DROP COLUMN "profileId",
ADD COLUMN     "profile_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "authorId",
DROP COLUMN "expires_at",
DROP COLUMN "isPrivate",
ADD COLUMN     "author_id" INTEGER,
ADD COLUMN     "expired_at" TIMESTAMPTZ(3),
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
