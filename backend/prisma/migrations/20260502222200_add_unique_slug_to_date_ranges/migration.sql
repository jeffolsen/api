/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `date_ranges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `date_ranges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "date_ranges" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "date_ranges_slug_key" ON "date_ranges"("slug");
