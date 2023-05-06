/*
  Warnings:

  - Added the required column `author` to the `CommentReaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentReaction" DROP CONSTRAINT "CommentReaction_userId_fkey";

-- AlterTable
ALTER TABLE "CommentReaction" ADD COLUMN     "author" TEXT NOT NULL;
