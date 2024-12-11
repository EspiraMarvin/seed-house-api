-- CreateTable
CREATE TABLE "SeedStockHistory" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "seed_id" TEXT NOT NULL,
    "previous_stock" INTEGER NOT NULL,
    "new_stock" INTEGER NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedStockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeedStockHistory_uuid_key" ON "SeedStockHistory"("uuid");

-- CreateIndex
CREATE INDEX "SeedStockHistory_seed_id_idx" ON "SeedStockHistory"("seed_id");

-- AddForeignKey
ALTER TABLE "SeedStockHistory" ADD CONSTRAINT "SeedStockHistory_seed_id_fkey" FOREIGN KEY ("seed_id") REFERENCES "Seed"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
