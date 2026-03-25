/*
  Warnings:

  - You are about to drop the `ComponentType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "components" DROP CONSTRAINT "components_component_type_id_fkey";

-- DropTable
DROP TABLE "ComponentType";

-- CreateTable
CREATE TABLE "component_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "item_binding" "ItemBinding" NOT NULL DEFAULT 'FILTERED_BY_TAG',
    "propertySchema" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "component_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "component_types_name_key" ON "component_types"("name");

-- AddForeignKey
ALTER TABLE "components" ADD CONSTRAINT "components_component_type_id_fkey" FOREIGN KEY ("component_type_id") REFERENCES "component_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
