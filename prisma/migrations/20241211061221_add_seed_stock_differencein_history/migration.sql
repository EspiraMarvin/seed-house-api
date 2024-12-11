/*
  Warnings:

  - Added the required column `stock_difference` to the `SeedStockHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeedStockHistory" ADD COLUMN     "stock_difference" INTEGER NOT NULL;
