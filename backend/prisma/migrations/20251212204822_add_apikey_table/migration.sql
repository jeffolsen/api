/*
  Warnings:

  - You are about to drop the column `auto_refresh` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "auto_refresh",
ADD COLUMN     "api_key_id" INTEGER,
ALTER COLUMN "expires_at" DROP NOT NULL,
ALTER COLUMN "expires_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '8 HOURS';

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "session_id" INTEGER,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_slug_key" ON "api_keys"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_profile_id_key" ON "api_keys"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_session_id_key" ON "api_keys"("session_id");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
