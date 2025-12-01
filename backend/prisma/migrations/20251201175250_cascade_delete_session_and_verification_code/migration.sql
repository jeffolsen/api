/*
  Warnings:

  - You are about to drop the column `codeType` on the `verificationCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_profileId_fkey";

-- DropForeignKey
ALTER TABLE "verificationCode" DROP CONSTRAINT "verificationCode_profileId_fkey";

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '2 DAYS';

-- AlterTable
ALTER TABLE "verificationCode" DROP COLUMN "codeType",
ADD COLUMN     "type" "codeType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 HOURS';

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificationCode" ADD CONSTRAINT "verificationCode_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
