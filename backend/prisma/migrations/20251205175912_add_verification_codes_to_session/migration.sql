/*
  Warnings:

  - You are about to drop the column `twoFactorRefresh` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `verificationCode` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `verificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "twoFactorRefresh",
ADD COLUMN     "autoRefresh" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '2 DAYS',
ALTER COLUMN "scope" SET DEFAULT '';

-- AlterTable
ALTER TABLE "verificationCode" DROP COLUMN "verified",
ADD COLUMN     "sessionId" INTEGER NOT NULL,
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '8 HOURS';

-- AddForeignKey
ALTER TABLE "verificationCode" ADD CONSTRAINT "verificationCode_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
