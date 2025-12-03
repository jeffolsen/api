/*
  Warnings:

  - Added the required column `value` to the `verificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '2 DAYS';

-- AlterTable
ALTER TABLE "verificationCode" ADD COLUMN     "value" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '8 HOURS';
