-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);
