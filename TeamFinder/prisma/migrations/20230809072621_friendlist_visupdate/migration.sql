/*
  Warnings:

  - You are about to drop the column `private_frnd_list` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "private_frnd_list",
ALTER COLUMN "frnd_list_vis" SET DATA TYPE TEXT;
