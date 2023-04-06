/*
  Warnings:

  - The `twitchtoken` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "deleted" BOOLEAN;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twitchtoken",
ADD COLUMN     "twitchtoken" JSONB;
