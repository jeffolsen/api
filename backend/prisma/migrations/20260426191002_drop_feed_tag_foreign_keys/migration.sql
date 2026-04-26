/*
  Warnings:

  - You are about to drop the column `tag_id` on the `feeds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "feeds" DROP CONSTRAINT "feeds_tag_id_fkey";

-- AlterTable
ALTER TABLE "feeds" DROP COLUMN "tag_id";
