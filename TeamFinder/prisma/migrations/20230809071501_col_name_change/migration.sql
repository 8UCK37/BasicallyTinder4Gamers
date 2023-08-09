/*
  Warnings:

  - You are about to drop the column `public_frnd_list` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "public_frnd_list",
ADD COLUMN     "private_frnd_list" BOOLEAN;
