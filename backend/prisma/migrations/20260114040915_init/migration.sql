-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('LOGIN', 'LOGOUT_ALL', 'PASSWORD_RESET', 'DELETE_PROFILE', 'CREATE_API_KEY');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('BASIC_BLOCK');

-- CreateEnum
CREATE TYPE "TagName" AS ENUM ('PERSON', 'PLACE', 'THING', 'PAST', 'PRESENT', 'FUTURE', 'RED', 'BLUE', 'GREEN', 'FOO', 'BAR', 'BAZ');

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "scope" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW() + INTERVAL '4 DAYS',
    "ended_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "api_key_id" INTEGER,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" SERIAL NOT NULL,
    "type" "CodeType" NOT NULL DEFAULT 'LOGIN',
    "value" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW() + INTERVAL '8 HOURS',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "profile_id" INTEGER,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "value" TEXT,
    "origin" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "session_id" INTEGER,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeds" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "type" "ComponentType" NOT NULL DEFAULT 'BASIC_BLOCK',
    "title" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "feedId" INTEGER NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" "TagName" NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ItemToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_slug_key" ON "api_keys"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_profile_id_key" ON "api_keys"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_session_id_key" ON "api_keys"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "feeds_path_key" ON "feeds"("path");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "_ItemToTag_B_index" ON "_ItemToTag"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToTag" ADD CONSTRAINT "_ItemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
