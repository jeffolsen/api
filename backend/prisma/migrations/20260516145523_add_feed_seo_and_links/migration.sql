-- CreateEnum
CREATE TYPE "SchemaType" AS ENUM ('WebPage', 'Person', 'Article', 'CreativeWork');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('internal', 'external');

-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "schema_type" "SchemaType",
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_image" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- CreateTable
CREATE TABLE "links" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "link_type" "LinkType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeds_links" (
    "feed_id" INTEGER NOT NULL,
    "link_id" INTEGER NOT NULL,

    CONSTRAINT "feeds_links_pkey" PRIMARY KEY ("feed_id","link_id")
);

-- AddForeignKey
ALTER TABLE "feeds_links" ADD CONSTRAINT "feeds_links_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_links" ADD CONSTRAINT "feeds_links_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
