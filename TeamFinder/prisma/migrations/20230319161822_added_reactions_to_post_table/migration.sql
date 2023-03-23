/*
  Warnings:

  - Added the required column `fire_count` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `haha_count` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `love_count` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poop_count` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sad_count` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "fire_count" INTEGER NOT NULL,
ADD COLUMN     "haha_count" INTEGER NOT NULL,
ADD COLUMN     "love_count" INTEGER NOT NULL,
ADD COLUMN     "poop_count" INTEGER NOT NULL,
ADD COLUMN     "sad_count" INTEGER NOT NULL;
