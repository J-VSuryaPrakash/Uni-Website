/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `NotificationAttachment` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `NotificationAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "uploadedBy";

-- AlterTable
ALTER TABLE "NotificationAttachment" DROP COLUMN "fileUrl",
ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMedia" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "position" INTEGER,
    "altText" VARCHAR(150),

    CONSTRAINT "EventMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_slug_key" ON "EventCategory"("slug");

-- CreateIndex
CREATE INDEX "EventCategory_isActive_position_idx" ON "EventCategory"("isActive", "position");

-- CreateIndex
CREATE INDEX "Event_categoryId_isActive_position_idx" ON "Event"("categoryId", "isActive", "position");

-- CreateIndex
CREATE INDEX "Event_eventDate_idx" ON "Event"("eventDate" DESC);

-- CreateIndex
CREATE INDEX "EventMedia_eventId_position_idx" ON "EventMedia"("eventId", "position");

-- AddForeignKey
ALTER TABLE "NotificationAttachment" ADD CONSTRAINT "NotificationAttachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
