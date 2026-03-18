/*
  Warnings:

  - You are about to drop the `_ItemToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToTag" DROP CONSTRAINT "_ItemToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToTag" DROP CONSTRAINT "_ItemToTag_B_fkey";

-- DropTable
DROP TABLE "_ItemToTag";

-- CreateTable
CREATE TABLE "items_tags" (
    "item_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "items_tags_pkey" PRIMARY KEY ("item_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "items_tags" ADD CONSTRAINT "items_tags_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_tags" ADD CONSTRAINT "items_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
