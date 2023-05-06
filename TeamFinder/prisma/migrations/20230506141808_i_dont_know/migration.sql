-- AlterTable
ALTER TABLE "User" ADD COLUMN     "postsId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
