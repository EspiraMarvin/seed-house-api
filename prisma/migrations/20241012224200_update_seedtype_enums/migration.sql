/*
  Warnings:

  - The `type` column on the `Seed` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SEEDTYPE" AS ENUM ('in-house', 'out-sourced');

-- AlterTable
ALTER TABLE "Seed" DROP COLUMN "type",
ADD COLUMN     "type" "SEEDTYPE" NOT NULL DEFAULT 'in-house';

-- DropEnum
DROP TYPE "SeedType";
