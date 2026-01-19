/*
  Warnings:

  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "link",
ADD COLUMN     "departmentId" INTEGER;

-- CreateTable
CREATE TABLE "NotificationAttachment" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "fileUrl" VARCHAR(500) NOT NULL,
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAttachment" ADD CONSTRAINT "NotificationAttachment_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
