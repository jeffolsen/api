-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('LANDSCAPE', 'PORTRAIT', 'ICON', 'OTHER');

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "type" "ImageType" NOT NULL DEFAULT 'OTHER';
