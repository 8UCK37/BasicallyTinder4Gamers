/*
  Warnings:

  - You are about to drop the column `postsId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postsId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postsId",
ADD COLUMN     "post_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
