/*
  Warnings:

  - The values [in-house,out-sourced] on the enum `SEEDTYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SEEDTYPE_new" AS ENUM ('in_house', 'out_sourced');
ALTER TABLE "Seed" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Seed" ALTER COLUMN "type" TYPE "SEEDTYPE_new" USING ("type"::text::"SEEDTYPE_new");
ALTER TYPE "SEEDTYPE" RENAME TO "SEEDTYPE_old";
ALTER TYPE "SEEDTYPE_new" RENAME TO "SEEDTYPE";
DROP TYPE "SEEDTYPE_old";
ALTER TABLE "Seed" ALTER COLUMN "type" SET DEFAULT 'in_house';
COMMIT;

-- AlterTable
ALTER TABLE "Seed" ALTER COLUMN "type" SET DEFAULT 'in_house';
