/*
  Warnings:

  - You are about to drop the column `title` on the `items` table. All the data in the column will be lost.
  - Added the required column `name` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sort_name` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sort_name" TEXT NOT NULL;
