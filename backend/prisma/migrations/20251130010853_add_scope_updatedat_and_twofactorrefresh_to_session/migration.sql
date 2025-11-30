/*
  Warnings:

  - Added the required column `scope` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `session` table without a default value. This is not possible if the table is not empty.
  - Made the column `userAgent` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "scope" TEXT NOT NULL,
ADD COLUMN     "twoFactorRefresh" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userAgent" SET NOT NULL,
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAYS';
