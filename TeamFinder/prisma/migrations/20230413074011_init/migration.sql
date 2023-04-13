/*
  Warnings:

  - You are about to drop the column `author` on the `CommentReaction` table. All the data in the column will be lost.
  - Added the required column `authorid` to the `CommentReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentReaction" DROP COLUMN "author",
ADD COLUMN     "authorid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
