/*
  Warnings:

  - The `sku` column on the `Seed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uuid]` on the table `Seed` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Seed` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "SKU" AS ENUM ('GRAMS', 'KGS');

-- AlterTable
ALTER TABLE "Seed" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
DROP COLUMN "sku",
ADD COLUMN     "sku" "SKU" NOT NULL DEFAULT 'KGS';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isActive" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Seed_uuid_key" ON "Seed"("uuid");
