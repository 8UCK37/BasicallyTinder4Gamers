/*
  Warnings:

  - You are about to drop the column `data` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `description` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "data",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL;
