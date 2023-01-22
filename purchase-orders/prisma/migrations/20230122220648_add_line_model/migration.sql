/*
  Warnings:

  - A unique constraint covering the columns `[lineId]` on the table `ProductLine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lineId` to the `ProductLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductLine" ADD COLUMN     "lineId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Line" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductLine_lineId_key" ON "ProductLine"("lineId");

-- AddForeignKey
ALTER TABLE "ProductLine" ADD CONSTRAINT "ProductLine_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
