/*
  Warnings:

  - A unique constraint covering the columns `[productLineId]` on the table `PurchaseOrderLine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productLineId` to the `PurchaseOrderLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseOrderLine" ADD COLUMN     "productLineId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrderLine_productLineId_key" ON "PurchaseOrderLine"("productLineId");

-- AddForeignKey
ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_productLineId_fkey" FOREIGN KEY ("productLineId") REFERENCES "ProductLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
