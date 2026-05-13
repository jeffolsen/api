-- CreateTable
CREATE TABLE "feeds_tags" (
    "feed_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "feeds_tags_pkey" PRIMARY KEY ("feed_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "feeds_tags" ADD CONSTRAINT "feeds_tags_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds_tags" ADD CONSTRAINT "feeds_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
