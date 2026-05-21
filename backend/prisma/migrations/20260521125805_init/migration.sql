-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('LOGIN', 'LOGOUT_ALL', 'PASSWORD_RESET', 'DELETE_PROFILE', 'CREATE_API_KEY');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('SINGLE', 'COLLECTION');

-- CreateEnum
CREATE TYPE "SchemaType" AS ENUM ('WebPage', 'Person', 'Article', 'CreativeWork');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('internal', 'external');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('LANDSCAPE', 'PORTRAIT', 'ICON', 'OTHER');

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_receipts" (
    "id" SERIAL NOT NULL,
    "consent_to_terms_at" TIMESTAMPTZ(6) NOT NULL,
    "consent_to_privacy_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_age_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_email_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "profile_id" INTEGER,

    CONSTRAINT "profile_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "scope" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "expired_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() + '4 days'::interval),
    "ended_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" SERIAL NOT NULL,
    "type" "CodeType" NOT NULL DEFAULT 'LOGIN',
    "value" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "expired_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() + '08:00:00'::interval),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "profile_id" INTEGER,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "value" TEXT,
    "origin" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeds" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "subject_type" "SubjectType" NOT NULL DEFAULT 'COLLECTION',
    "published_at" TIMESTAMPTZ(6),
    "expired_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "seo_image" TEXT,
    "schema_type" "SchemaType",
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "component_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject_type" "SubjectType" NOT NULL DEFAULT 'COLLECTION',
    "property_schema" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "component_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "property_values" JSONB NOT NULL DEFAULT '{}',
    "component_type_id" INTEGER NOT NULL,
    "type_name" TEXT NOT NULL,
    "feed_id" INTEGER NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "expired_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_name" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "override_link" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "expired_at" TIMESTAMPTZ(6),
    "rich_content" JSONB NOT NULL DEFAULT '{}',
    "author_id" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_tags" (
    "item_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "items_tags_pkey" PRIMARY KEY ("item_id","tag_id")
);

-- CreateTable
CREATE TABLE "feeds_tags" (
    "feed_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "feeds_tags_pkey" PRIMARY KEY ("feed_id","tag_id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "attribution" TEXT,
    "attribution_link" TEXT,
    "type" "ImageType" NOT NULL DEFAULT 'OTHER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_images" (
    "item_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "items_images_pkey" PRIMARY KEY ("item_id","image_id")
);

-- CreateTable
CREATE TABLE "date_ranges" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "date_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_receipts_profile_id_key" ON "profile_receipts"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_slug_key" ON "api_keys"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_profile_id_path_subject_type_key" ON "feeds"("profile_id", "path", "subject_type");

-- CreateIndex
CREATE UNIQUE INDEX "component_types_name_key" ON "component_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "components_feed_id_order_key" ON "components"("feed_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "items_slug_key" ON "items"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "images_url_key" ON "images"("url");

-- CreateIndex
CREATE UNIQUE INDEX "date_ranges_slug_key" ON "date_ranges"("slug");

-- AddForeignKey
ALTER TABLE "profile_receipts" ADD CONSTRAINT "profile_receipts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_links" ADD CONSTRAINT "feeds_links_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_links" ADD CONSTRAINT "feeds_links_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_component_type_id_fkey" FOREIGN KEY ("component_type_id") REFERENCES "component_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_tags" ADD CONSTRAINT "items_tags_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_tags" ADD CONSTRAINT "items_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_tags" ADD CONSTRAINT "feeds_tags_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_tags" ADD CONSTRAINT "feeds_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_images" ADD CONSTRAINT "items_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_images" ADD CONSTRAINT "items_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_ranges" ADD CONSTRAINT "date_ranges_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
