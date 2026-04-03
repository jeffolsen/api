/*
  Warnings:

  - You are about to drop the column `propertySchema` on the `component_types` table. All the data in the column will be lost.
  - You are about to drop the column `feedId` on the `components` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[feed_id,order]` on the table `components` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feed_id` to the `components` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "components" DROP CONSTRAINT "components_feedId_fkey";

-- DropIndex
DROP INDEX "components_feedId_order_key";

-- AlterTable
ALTER TABLE "component_types" DROP COLUMN "propertySchema",
ADD COLUMN     "property_schema" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "components" DROP COLUMN "feedId",
ADD COLUMN     "feed_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "components_feed_id_order_key" ON "components"("feed_id", "order");

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
