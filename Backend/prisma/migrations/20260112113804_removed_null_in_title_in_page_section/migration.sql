/*
  Warnings:

  - Made the column `title` on table `PageSection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PageSection" ALTER COLUMN "title" SET NOT NULL;
