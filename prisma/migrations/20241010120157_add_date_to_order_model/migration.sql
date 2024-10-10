/*
  Warnings:

  - Added the required column `collection_date` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "collection_date" TIMESTAMP(3) NOT NULL;
