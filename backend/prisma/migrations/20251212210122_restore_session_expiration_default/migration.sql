/*
  Warnings:

  - Made the column `expires_at` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET NOT NULL,
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';
