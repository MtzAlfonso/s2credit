/*
  Warnings:

  - You are about to drop the column `todoId` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_todoId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "todoId";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_id_fkey" FOREIGN KEY ("id") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
