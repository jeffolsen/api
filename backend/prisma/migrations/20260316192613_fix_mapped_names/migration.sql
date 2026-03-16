/*
  Warnings:

  - The primary key for the `items_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageId` on the `items_images` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `items_images` table. All the data in the column will be lost.
  - Added the required column `image_id` to the `items_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `items_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items_images" DROP CONSTRAINT "items_images_imageId_fkey";

-- DropForeignKey
ALTER TABLE "items_images" DROP CONSTRAINT "items_images_itemId_fkey";

-- AlterTable
ALTER TABLE "items_images" DROP CONSTRAINT "items_images_pkey",
DROP COLUMN "imageId",
DROP COLUMN "itemId",
ADD COLUMN     "image_id" INTEGER NOT NULL,
ADD COLUMN     "item_id" INTEGER NOT NULL,
ADD CONSTRAINT "items_images_pkey" PRIMARY KEY ("item_id", "image_id");

-- AddForeignKey
ALTER TABLE "items_images" ADD CONSTRAINT "items_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_images" ADD CONSTRAINT "items_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
