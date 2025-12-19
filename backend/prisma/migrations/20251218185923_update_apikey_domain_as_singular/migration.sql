/*
  Warnings:

  - You are about to drop the column `domains` on the `api_keys` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "domains",
ADD COLUMN     "domain" TEXT;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';
