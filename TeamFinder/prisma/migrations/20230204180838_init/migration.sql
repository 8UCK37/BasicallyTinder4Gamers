/*
  Warnings:

  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "profilePicture" TEXT,
    "steamId" TEXT,
    "gmailId" TEXT,
    "activeChoice" BOOLEAN
);
INSERT INTO "new_User" ("createdAt", "gmailId", "id", "name", "profilePicture", "steamId") SELECT "createdAt", "gmailId", "id", "name", "profilePicture", "steamId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
