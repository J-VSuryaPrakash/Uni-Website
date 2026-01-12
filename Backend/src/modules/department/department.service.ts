import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateDepartmentDTO, UpdateDepartmentDTO } from "./department.validation";

export default class DepartmentService {

    async createDepartment(data: CreateDepartmentDTO) {

        const newDepartment = await prisma.department.create({
            data: {
                name: data.name,
            }
        })

        return newDepartment;
    }

    async updateDepartment(id: number, data: Partial<UpdateDepartmentDTO>) {

        const department = await prisma.department.findUnique({
            where: { id }
        });

        if (!department) {
            throw new ApiError(404, "Department not found");
        }

        const updatedDepartment = await prisma.department.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name })
            }
        })

        return updatedDepartment;
    }

    async getAllDepartments() {

        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' }
        });
        
        return departments;
    }

    async deleteDepartment(id: number) {

        const deletedDepartment = await prisma.department.delete({
            where: { id }
        });

        if (!deletedDepartment) {
            throw new ApiError(404, "Department not found");
        }

        return deletedDepartment;
    }

}