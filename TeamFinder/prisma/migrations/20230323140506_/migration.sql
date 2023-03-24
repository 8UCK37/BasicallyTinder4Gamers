/*
  Warnings:

  - You are about to drop the column `gender` on the `UserInfo` table. All the data in the column will be lost.
  - Added the required column `Gender` to the `UserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "gender",
ADD COLUMN     "Gender" TEXT NOT NULL;
