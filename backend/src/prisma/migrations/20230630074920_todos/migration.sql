-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated" BOOLEAN NOT NULL DEFAULT false;
