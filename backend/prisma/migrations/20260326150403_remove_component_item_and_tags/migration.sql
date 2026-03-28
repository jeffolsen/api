/*
  Warnings:

  - You are about to drop the column `item_binding` on the `component_types` table. All the data in the column will be lost.
  - You are about to drop the `components_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `components_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "components_items" DROP CONSTRAINT "components_items_component_id_fkey";

-- DropForeignKey
ALTER TABLE "components_items" DROP CONSTRAINT "components_items_item_id_fkey";

-- DropForeignKey
ALTER TABLE "components_tags" DROP CONSTRAINT "components_tags_component_id_fkey";

-- DropForeignKey
ALTER TABLE "components_tags" DROP CONSTRAINT "components_tags_tag_id_fkey";

-- AlterTable
ALTER TABLE "component_types" DROP COLUMN "item_binding",
ADD COLUMN     "subject_type" "SubjectType" NOT NULL DEFAULT 'COLLECTION';

-- DropTable
DROP TABLE "components_items";

-- DropTable
DROP TABLE "components_tags";

-- DropEnum
DROP TYPE "ItemBinding";
