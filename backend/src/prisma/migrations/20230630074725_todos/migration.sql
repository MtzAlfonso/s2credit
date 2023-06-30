/*
  Warnings:

  - The primary key for the `History` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `remoteId` on the `History` table. All the data in the column will be lost.
  - The `todoId` column on the `History` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Todo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Todo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - The required column `historyId` was added to the `History` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `id` on the `History` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Todo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_todoId_fkey";

-- DropIndex
DROP INDEX "Todo_remoteId_key";

-- AlterTable
ALTER TABLE "History" DROP CONSTRAINT "History_pkey",
DROP COLUMN "remoteId",
ADD COLUMN     "historyId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "todoId",
ADD COLUMN     "todoId" INTEGER,
ADD CONSTRAINT "History_pkey" PRIMARY KEY ("historyId");

-- AlterTable
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "remoteId",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Todo_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Todo_id_key" ON "Todo"("id");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
