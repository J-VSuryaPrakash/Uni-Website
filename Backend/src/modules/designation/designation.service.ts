import prisma from "../../DB/prisma";
import type { CreateDesignationDTO, UpdateDesignationDTO } from "./designation.validation";
import { ApiError } from "../../utils/apiError";

export default class DesignationService {

    async createDesignation(data: CreateDesignationDTO) {

        const exists = await prisma.designation.findUnique({
            where: { title: data.title }
        })

        if (exists) {
            throw new Error("Designation with this title already exists");
        }

        const designation = await prisma.designation.create({
            data: {
                title: data.title,
                priority: data.priority
            }
        });

        return designation;
    }

    async updateDesignation(id: number, data: UpdateDesignationDTO) {
       
        const designation = await prisma.designation.findUnique({
            where: { id }
        });
        
        if (!designation) {
            throw new ApiError(404, "Designation not found");
        }
        
        if (Object.keys(data).length === 0) {
            throw new ApiError(400, "At least one field must be provided");
        }

        const updatedDesignation = await prisma.designation.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.priority !== undefined && { priority: data.priority }),
            }
        });

        return updatedDesignation;
    }

    async getAllDesignations() {
        const designations = await prisma.designation.findMany({
            orderBy: { priority: 'asc' }
        });
        return designations;
    }

    async deleteDesignation(id: number) {
        const designation = await prisma.designation.findUnique({
            where: { id }
        });

        if (!designation) {
            throw new ApiError(404, "Designation not found");
        }

        await prisma.designation.delete({
            where: { id }
        });
    }
}
