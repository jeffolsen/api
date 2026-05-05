-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_author_id_fkey";

-- CreateTable
CREATE TABLE "profile_receipts" (
    "id" SERIAL NOT NULL,
    "consent_to_terms_at" TIMESTAMPTZ(6) NOT NULL,
    "consent_to_privacy_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_age_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_email_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "profile_id" INTEGER,

    CONSTRAINT "profile_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_receipts_profile_id_key" ON "profile_receipts"("profile_id");

-- AddForeignKey
ALTER TABLE "profile_receipts" ADD CONSTRAINT "profile_receipts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
