import { ApiError } from "../../utils/apiError";
import prisma from "../../DB/prisma";
import type { CreatePageDirectorateDTO } from "./pageDirectorates.validation";

export class PageDirectoratesService {

    async createPageDirectorate(data: CreatePageDirectorateDTO) {

        // 1. Check page exists
        const page = await prisma.page.findUnique({
            where: { id: data.pageId },
            select: { id: true },
        });

        if (!page) {
            throw new ApiError(404, "Page not found");
        }

        // 2. Check directorate exists
        const directorate = await prisma.directorate.findUnique({
            where: { id: data.directorateId },
            select: { id: true },
        });

        if (!directorate) {
            throw new ApiError(404, "Directorate not found");
        }

        // 3. Check mapping already exists
        const existingMapping = await prisma.pageDirectorates.findUnique({
            where: {
                pageId_directorateId: {
                    pageId: data.pageId,
                    directorateId: data.directorateId,
                },
            },
        });

        if (existingMapping) {
            throw new ApiError(409, "Directorate already attached to this page");
        }

        // 4. Create mapping
        const pageDirectorate = await prisma.pageDirectorates.create({
            data: {
                pageId: data.pageId,
                directorateId: data.directorateId,
                position: data.position,
            }
        });

        return pageDirectorate;
    }

    async getPageDirectorates() {

        const pageDirectorates = await prisma.pageDirectorates.findMany({
            include: {
                page: true,
                directorate: true
            },
            orderBy: { position: 'asc' }
        });

        if (pageDirectorates.length === 0) {
            throw new ApiError(200, "No page directorates found");
        }

        return pageDirectorates;
    }

    async getPageDirectoratesForPage(pageId: number) {
        
        const pageDirectorates = await prisma.pageDirectorates.findMany({
            where: { pageId },
            include: {
                directorate: true
            },
            orderBy: { position: 'asc' }
        });
        
        if (pageDirectorates.length === 0) {
            throw new ApiError(200, "No page directorates found for this page");
        }
        
        return pageDirectorates;
    }
 
    async getPageDirectorateById(pageId: number, directorateId: number) {

        const pageDirectorate = await prisma.pageDirectorates.findUnique({
            where: { pageId_directorateId: { pageId, directorateId } },
            include: {
                page: true,
                directorate: true
            }
        });

        if (!pageDirectorate) {
            throw new ApiError(404, "Page directorate not found");
        }

        return pageDirectorate;
    }    

    async updatePageDirectoratePosition(pageId: number, directorateId: number, position: number) {

        const pageDirectorate = await prisma.pageDirectorates.update({
            where: { pageId_directorateId: { pageId, directorateId } },
            data: { position }
        });

        if (!pageDirectorate) {
            throw new ApiError(404, "Page directorate not found");
        }

        return pageDirectorate;
    }

    async deletePageDirectorate(pageId: number, directorateId: number) {
    
        const pageDirectorate = await prisma.pageDirectorates.delete({
            where: { pageId_directorateId: { pageId, directorateId } }
        });
    
        if(!pageDirectorate) {
            throw new ApiError(404, "Page directorate not found");
        }
    
        return pageDirectorate;
    }

}