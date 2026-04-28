/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "items_slug_key" ON "items"("slug");
