/*
  Warnings:

  - Added the required column `total_amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "total_amount" DOUBLE PRECISION NOT NULL;
