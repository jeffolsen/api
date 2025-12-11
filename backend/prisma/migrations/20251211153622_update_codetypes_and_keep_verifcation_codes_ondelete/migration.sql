/*
  Warnings:

  - The values [EMAIL_VERIFICATION] on the enum `CodeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `used` on the `verification_codes` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CodeType_new" AS ENUM ('LOGIN', 'LOGOUT_ALL', 'PASSWORD_RESET', 'DELETE_PROFILE');
ALTER TABLE "public"."verification_codes" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "verification_codes" ALTER COLUMN "type" TYPE "CodeType_new" USING ("type"::text::"CodeType_new");
ALTER TYPE "CodeType" RENAME TO "CodeType_old";
ALTER TYPE "CodeType_new" RENAME TO "CodeType";
DROP TYPE "public"."CodeType_old";
ALTER TABLE "verification_codes" ALTER COLUMN "type" SET DEFAULT 'LOGIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "verification_codes" DROP CONSTRAINT "verification_codes_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "verification_codes" DROP CONSTRAINT "verification_codes_session_id_fkey";

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "ended_at" TIMESTAMP(3),
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '2 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" DROP COLUMN "used",
ADD COLUMN     "used_at" TIMESTAMP(3),
ALTER COLUMN "type" SET DEFAULT 'LOGIN',
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS',
ALTER COLUMN "profile_id" DROP NOT NULL,
ALTER COLUMN "session_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
