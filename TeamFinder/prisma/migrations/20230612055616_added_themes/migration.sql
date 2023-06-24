-- CreateTable
CREATE TABLE "Themes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "navBg" TEXT,
    "homeBg" TEXT,
    "profileBg" TEXT,
    "accentColor" TEXT,
    "compColor" TEXT,

    CONSTRAINT "Themes_pkey" PRIMARY KEY ("id")
);
