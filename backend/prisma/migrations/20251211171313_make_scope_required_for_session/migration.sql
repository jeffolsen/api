-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "scope" DROP DEFAULT,
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '2 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';
