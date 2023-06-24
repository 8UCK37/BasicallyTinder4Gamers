-- AlterTable
ALTER TABLE "User" ADD COLUMN     "themeId" INTEGER,
ADD COLUMN     "themesId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_themesId_fkey" FOREIGN KEY ("themesId") REFERENCES "Themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
