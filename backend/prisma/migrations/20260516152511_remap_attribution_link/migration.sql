/*
  Warnings:

  - You are about to drop the column `attributionLink` on the `images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "attributionLink",
ADD COLUMN     "attribution_link" TEXT;
