/*
  Warnings:

  - The primary key for the `Line` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrderLine" DROP CONSTRAINT "PurchaseOrderLine_lineId_fkey";

-- AlterTable
ALTER TABLE "Line" DROP CONSTRAINT "Line_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Line_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseOrderLine" ALTER COLUMN "lineId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;
