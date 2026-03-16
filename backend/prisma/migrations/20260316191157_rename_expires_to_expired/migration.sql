/*
  Warnings:

  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `verification_codes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMPTZ(3) NOT NULL DEFAULT (now() + '4 days'::interval);

-- AlterTable
ALTER TABLE "verification_codes" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMPTZ(3) NOT NULL DEFAULT (now() + '08:00:00'::interval);
