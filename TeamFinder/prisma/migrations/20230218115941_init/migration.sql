/*
  Warnings:

  - The primary key for the `OwnedGames` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OwnedGames` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OwnedGames" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "games" TEXT NOT NULL
);
INSERT INTO "new_OwnedGames" ("createdAt", "games", "uid") SELECT "createdAt", "games", "uid" FROM "OwnedGames";
DROP TABLE "OwnedGames";
ALTER TABLE "new_OwnedGames" RENAME TO "OwnedGames";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
