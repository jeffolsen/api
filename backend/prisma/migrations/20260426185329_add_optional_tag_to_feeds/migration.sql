-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "tag_id" INTEGER;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
