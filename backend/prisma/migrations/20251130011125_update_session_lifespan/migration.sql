-- AlterTable
ALTER TABLE "session" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '2 DAYS';

-- AlterTable
ALTER TABLE "verificationCode" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '1 HOURS';
