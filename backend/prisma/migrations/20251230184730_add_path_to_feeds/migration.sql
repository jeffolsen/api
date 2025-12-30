/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `feeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';

-- CreateIndex
CREATE UNIQUE INDEX "feeds_path_key" ON "feeds"("path");
