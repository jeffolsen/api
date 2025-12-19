-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '4 DAYS';

-- AlterTable
ALTER TABLE "verification_codes" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '8 HOURS';

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);
