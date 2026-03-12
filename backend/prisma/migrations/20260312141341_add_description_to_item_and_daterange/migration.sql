/*
  Warnings:

  - You are about to drop the column `content` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "date_ranges" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "content",
DROP COLUMN "subtitle",
ADD COLUMN     "description" TEXT;
