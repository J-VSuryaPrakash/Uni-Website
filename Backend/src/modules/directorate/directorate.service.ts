import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { createDirectorateDTO, updateDirectorateDTO } from "./directorate.validation";

const directorateInclude = {
    designations: {
        include: {
            designation: true,
        },
    },
    department: true,
    photo: true,
} as const;

export class DirectorateService {

    async createDirectorate(data: createDirectorateDTO) {
        const directorate = await prisma.$transaction(async (tx) => {
            const created = await tx.directorate.create({
                data: {
                    name: data.name,
                    ...(data.departmentId !== undefined && {
                        departmentId: data.departmentId,
                    }),
                    ...(data.photoMediaId !== undefined && {
                        photoMediaId: data.photoMediaId,
                    }),
                    ...(data.profile !== undefined && {
                        profile: data.profile === null ? Prisma.JsonNull : data.profile,
                    }),
                    isActive: data.isActive,
                },
            });

            if (data.designationIds && data.designationIds.length > 0) {
                await tx.directorateDesignation.createMany({
                    data: data.designationIds.map((designationId) => ({
                        directorateId: created.id,
                        designationId,
                    })),
                    skipDuplicates: true,
                });
            }

            return tx.directorate.findUnique({
                where: { id: created.id },
                include: directorateInclude,
            });
        });

        return directorate;
    }

    async getAllDirectorates() {
        const directorates = await prisma.directorate.findMany({
            include: directorateInclude,
            orderBy: { id: 'asc' },
        });

        return directorates;
    }

    async getDirectorateById(id: number) {
        const directorate = await prisma.directorate.findUnique({
            where: { id },
            include: directorateInclude,
        });

        if (!directorate) {
            throw new ApiError(404, "Directorate not found");
        }

        return directorate;
    }

    async updateDirectorate(id: number, data: updateDirectorateDTO) {
        const existingDirectorate = await prisma.directorate.findUnique({
            where: { id },
            select: { profile: true },
        });

        if (!existingDirectorate) {
            throw new ApiError(404, "Directorate not found");
        }

        const directorate = await prisma.$transaction(async (tx) => {
            await tx.directorate.update({
                where: { id },
                data: {
                    ...(data.name !== undefined && { name: data.name }),
                    ...(data.departmentId !== undefined && {
                        departmentId: data.departmentId,
                    }),
                    ...(data.photoMediaId !== undefined && {
                        photoMediaId: data.photoMediaId,
                    }),
                    ...(data.profile !== undefined && {
                        profile:
                            data.profile === null
                                ? Prisma.JsonNull
                                : {
                                      ...(existingDirectorate?.profile as object),
                                      ...data.profile,
                                  },
                    }),
                    ...(data.isActive !== undefined && { isActive: data.isActive }),
                },
            });

            if (data.designationIds !== undefined) {
                await tx.directorateDesignation.deleteMany({
                    where: { directorateId: id },
                });

                if (data.designationIds.length > 0) {
                    await tx.directorateDesignation.createMany({
                        data: data.designationIds.map((designationId) => ({
                            directorateId: id,
                            designationId,
                        })),
                        skipDuplicates: true,
                    });
                }
            }

            return tx.directorate.findUnique({
                where: { id },
                include: directorateInclude,
            });
        });

        return directorate;
    }

    async deleteDirectorate(id: number) {
        const exists = await prisma.directorate.findUnique({ where: { id } });

        if (!exists) {
            throw new ApiError(404, "Directorate not found");
        }

        const directorate = await prisma.directorate.delete({
            where: { id },
        });

        return directorate;
    }

    async getAllActiveDirectorates() {
        return prisma.directorate.findMany({
            where: { isActive: true },
            include: directorateInclude,
            orderBy: { id: 'asc' },
        });
    }

    async getDirectoratesByPageId(pageId: number) {
        const records = await prisma.pageDirectorates.findMany({
            where: { pageId },
            orderBy: { position: 'asc' },
            include: {
                directorate: {
                    include: directorateInclude,
                },
            },
        });

        return records.map((r) => r.directorate);
    }
}
