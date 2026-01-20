/*
  Warnings:

  - Added the required column `user_agent` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "user_agent" TEXT NOT NULL,
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';
