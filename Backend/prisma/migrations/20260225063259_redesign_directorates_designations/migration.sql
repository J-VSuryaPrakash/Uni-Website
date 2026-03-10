/*
  Warnings:

  - You are about to drop the column `designationId` on the `Directorate` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Directorate` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DesignationCategory" AS ENUM ('ADMINISTRATION', 'DIRECTORATES', 'PRINCIPALS', 'EXAMINATION');

-- DropForeignKey
ALTER TABLE "Directorate" DROP CONSTRAINT "Directorate_designationId_fkey";

-- AlterTable
ALTER TABLE "Designation" ADD COLUMN     "category" "DesignationCategory" NOT NULL DEFAULT 'ADMINISTRATION';

-- AlterTable
ALTER TABLE "Directorate" DROP COLUMN "designationId",
DROP COLUMN "photoUrl",
ADD COLUMN     "photoMediaId" INTEGER;

-- CreateTable
CREATE TABLE "DirectorateDesignation" (
    "directorateId" INTEGER NOT NULL,
    "designationId" INTEGER NOT NULL,

    CONSTRAINT "DirectorateDesignation_pkey" PRIMARY KEY ("directorateId","designationId")
);

-- AddForeignKey
ALTER TABLE "DirectorateDesignation" ADD CONSTRAINT "DirectorateDesignation_directorateId_fkey" FOREIGN KEY ("directorateId") REFERENCES "Directorate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectorateDesignation" ADD CONSTRAINT "DirectorateDesignation_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directorate" ADD CONSTRAINT "Directorate_photoMediaId_fkey" FOREIGN KEY ("photoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
