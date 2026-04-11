/*
  Warnings:

  - Added the required column `type_name` to the `components` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "components" ADD COLUMN     "type_name" TEXT NOT NULL;
