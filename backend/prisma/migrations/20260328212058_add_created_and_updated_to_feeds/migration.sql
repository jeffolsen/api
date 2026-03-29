/*
  Warnings:

  - Added the required column `updated_at` to the `feeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;
