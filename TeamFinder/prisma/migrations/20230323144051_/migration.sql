/*
  Warnings:

  - A unique constraint covering the columns `[userInfoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserInfo" ALTER COLUMN "Country" DROP NOT NULL,
ALTER COLUMN "Language" DROP NOT NULL,
ALTER COLUMN "Gender" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userInfoId_key" ON "User"("userInfoId");
