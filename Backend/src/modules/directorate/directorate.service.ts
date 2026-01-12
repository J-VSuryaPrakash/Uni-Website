import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { createDirectorateDTO, updateDirectorateDTO } from "./directorate.validation";

export class DirectorateService {

    async createDirectorate(data: createDirectorateDTO) {

        const directorate = await prisma.directorate.create({
            data: {
                name: data.name,
                ...(data.designationId !== undefined && {
                    designationId: data.designationId,
                }),
                ...(data.departmentId !== undefined && {
                    departmentId: data.departmentId,
                }),
                ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
                ...(data.profile !== undefined && {
                    profile: data.profile === null ? Prisma.JsonNull : data.profile,
                }),
                isActive: data.isActive,
            },
        });

        return directorate;
    }

    async getAllDirectorates() {

        const directorates = await prisma.directorate.findMany({
            include: {
                designation: true,
                department: true
            }
        });

        if (directorates.length === 0) {
            throw new ApiError(404, "No directorates found");
        }

        return directorates;
    }

    async getDirectorateById(id: number) {

        const exists = await prisma.directorate.findUnique({ where: { id } });

        if (!exists) {
            throw new ApiError(404, "Directorate not found");
        }

        const directorate = await prisma.directorate.findUnique({
            where: { id },
            include: {
                designation: true,
                department: true
            }
        });
        return directorate;
    }

    async updateDirectorate(id: number, data: updateDirectorateDTO) {

        const existingDirectorate = await prisma.directorate.findUnique({
            where: { id },
            select: { profile: true }
        });

        if (!existingDirectorate) {
            throw new ApiError(404, "Directorate not found");
        }

        const directorate = await prisma.directorate.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.designationId !== undefined && {
                    designationId: data.designationId,
                }),
                ...(data.departmentId !== undefined && {
                    departmentId: data.departmentId,
                }),
                ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
                ...(data.profile !== undefined && {
                    profile: data.profile === null ? Prisma.JsonNull : { ...(existingDirectorate?.profile as object), ...data.profile },
                }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        })

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

}
