/*
  Warnings:

  - The values [GRAMS,KGS] on the enum `SKU` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SKU_new" AS ENUM ('g', 'kg');
ALTER TABLE "Seed" ALTER COLUMN "sku" DROP DEFAULT;
ALTER TABLE "Seed" ALTER COLUMN "sku" TYPE "SKU_new" USING ("sku"::text::"SKU_new");
ALTER TYPE "SKU" RENAME TO "SKU_old";
ALTER TYPE "SKU_new" RENAME TO "SKU";
DROP TYPE "SKU_old";
ALTER TABLE "Seed" ALTER COLUMN "sku" SET DEFAULT 'kg';
COMMIT;

-- AlterTable
ALTER TABLE "Seed" ALTER COLUMN "sku" SET DEFAULT 'kg';
