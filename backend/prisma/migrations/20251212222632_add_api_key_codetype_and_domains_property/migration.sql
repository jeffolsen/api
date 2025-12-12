-- AlterEnum
ALTER TYPE "CodeType" ADD VALUE 'CREATE_API_KEY';

-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "domains" TEXT,
ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';
