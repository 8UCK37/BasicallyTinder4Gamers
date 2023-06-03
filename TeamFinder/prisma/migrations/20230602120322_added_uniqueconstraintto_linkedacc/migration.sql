/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LinkedAccounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccounts_userId_key" ON "LinkedAccounts"("userId");
