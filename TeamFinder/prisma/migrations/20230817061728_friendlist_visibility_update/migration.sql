/*
  Warnings:

  - The `frnd_list_vis` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "frnd_list_vis",
ADD COLUMN     "frnd_list_vis" INTEGER;
