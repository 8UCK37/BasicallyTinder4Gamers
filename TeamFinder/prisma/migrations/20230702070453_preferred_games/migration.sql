-- CreateTable
CREATE TABLE "PreferredGames" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prfGamesId" TEXT,
    "uId" TEXT NOT NULL,

    CONSTRAINT "PreferredGames_pkey" PRIMARY KEY ("id")
);
