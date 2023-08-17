/*
  Warnings:

  - The `linked_acc_vis` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "linked_acc_vis",
ADD COLUMN     "linked_acc_vis" INTEGER;
