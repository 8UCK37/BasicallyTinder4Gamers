-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_FriendRequest" ("createdAt", "from", "id", "status", "to") SELECT "createdAt", "from", "id", "status", "to" FROM "FriendRequest";
DROP TABLE "FriendRequest";
ALTER TABLE "new_FriendRequest" RENAME TO "FriendRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
