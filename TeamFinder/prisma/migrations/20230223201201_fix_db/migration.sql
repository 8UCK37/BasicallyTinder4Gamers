/*
  Warnings:

  - You are about to drop the column `tags` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `post` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "post" INTEGER NOT NULL;
