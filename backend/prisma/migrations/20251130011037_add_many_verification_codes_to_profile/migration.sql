-- CreateEnum
CREATE TYPE "codeType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 DAYS';

-- CreateTable
CREATE TABLE "verificationCode" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "codeType" "codeType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 HOURS',

    CONSTRAINT "verificationCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "verificationCode" ADD CONSTRAINT "verificationCode_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
