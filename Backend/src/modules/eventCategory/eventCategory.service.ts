import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateEventCategoryDTO, UpdateEventCategoryDTO } from "./eventCategory.validation";

export class EventCategoryService {

    async createCategory(data: CreateEventCategoryDTO) {

        const createCategory = await prisma.eventCategory.create({
            data: {
                name: data.name,
                slug: data.slug,
                position: data.position,
                isActive: data.isActive,
            }
        })

        return createCategory;
    }

    async getAllCategories() {

        const categories = await prisma.eventCategory.findMany({
            orderBy: {
                position: 'asc'
            }
        });

        if(!categories){
            throw new ApiError(404,'No Event Categories found');
        }
        return categories;
    }

    async updateCategory(id: number, data: UpdateEventCategoryDTO){
        
        const existingCategory = await prisma.eventCategory.findUnique({
            where: { id }
        });

        if(!existingCategory){
            throw new ApiError(404,'Event Category not found');
        }

        const updatedCategory = await prisma.eventCategory.update({
            where: { id },
            data: {
                name: data.name ?? existingCategory.name,
                slug: data.slug ?? existingCategory.slug,
                position: data.position ?? existingCategory.position,
                isActive: data.isActive ?? existingCategory.isActive,
            }
        });

        return updatedCategory;
    }

    async toggleCategoryStatus(id: number){

        const existingCategory = await prisma.eventCategory.findUnique({
            where: { id }
        });

        if(!existingCategory){
            throw new ApiError(404,'Event Category not found');
        }

        const updatedCategory = await prisma.eventCategory.update({
            where: { id },
            data: {
                isActive: !existingCategory.isActive,
            }
        });

        return updatedCategory;
    }

    async getActiveCategories() {

        const categories = await prisma.eventCategory.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                position: 'asc'
            }
        });

        if(!categories){
            return [];
        }

        return categories;
    }
}
