/*
  Warnings:

  - Added the required column `total_stock_added` to the `SeedStockHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeedStockHistory" ADD COLUMN     "total_stock_added" INTEGER NOT NULL;
