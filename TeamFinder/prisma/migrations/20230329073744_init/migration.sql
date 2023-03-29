/*
  Warnings:

  - You are about to drop the column `fire_count` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `haha_count` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `love_count` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `poop_count` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `sad_count` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "fire_count",
DROP COLUMN "haha_count",
DROP COLUMN "love_count",
DROP COLUMN "poop_count",
DROP COLUMN "sad_count";
