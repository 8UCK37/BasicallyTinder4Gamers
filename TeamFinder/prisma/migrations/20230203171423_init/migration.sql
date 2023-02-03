/*
  Warnings:

  - You are about to drop the column `from` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `reciever` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Friends" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender" TEXT NOT NULL,
    "reciever" TEXT NOT NULL
);
INSERT INTO "new_Friends" ("createdAt", "id") SELECT "createdAt", "id" FROM "Friends";
DROP TABLE "Friends";
ALTER TABLE "new_Friends" RENAME TO "Friends";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
