/*
  Warnings:

  - You are about to drop the column `prfGamesId` on the `PreferredGames` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreferredGames" DROP COLUMN "prfGamesId",
ADD COLUMN     "prfGames" TEXT;
