/*
  Warnings:

  - The values [TYPE_A,TYPE_B,TYPE_C] on the enum `SeedType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `update_at` on the `Seed` table. All the data in the column will be lost.
  - The `type` column on the `Seed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `Seed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeedType_new" AS ENUM ('in-house', 'out-sourced');
ALTER TABLE "Seed" ALTER COLUMN "type" TYPE "SeedType_new" USING ("type"::text::"SeedType_new");
ALTER TYPE "SeedType" RENAME TO "SeedType_old";
ALTER TYPE "SeedType_new" RENAME TO "SeedType";
DROP TYPE "SeedType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Seed" DROP COLUMN "update_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "SeedType" NOT NULL DEFAULT 'in-house';
