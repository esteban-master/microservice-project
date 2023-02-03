/*
  Warnings:

  - You are about to drop the column `productLineId` on the `PurchaseOrderLine` table. All the data in the column will be lost.
  - You are about to drop the `ProductLine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lineId]` on the table `PurchaseOrderLine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineId` to the `PurchaseOrderLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductLine" DROP CONSTRAINT "ProductLine_lineId_fkey";

-- DropForeignKey
ALTER TABLE "ProductLine" DROP CONSTRAINT "ProductLine_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderLine" DROP CONSTRAINT "PurchaseOrderLine_productLineId_fkey";

-- DropIndex
DROP INDEX "PurchaseOrderLine_productLineId_key";

-- AlterTable
ALTER TABLE "Line" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrderLine" DROP COLUMN "productLineId",
ADD COLUMN     "lineId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductLine";

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrderLine_lineId_key" ON "PurchaseOrderLine"("lineId");

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;
