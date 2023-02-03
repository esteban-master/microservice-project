/*
  Warnings:

  - The primary key for the `Line` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Line" DROP CONSTRAINT "Line_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Line_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Line_id_seq";
