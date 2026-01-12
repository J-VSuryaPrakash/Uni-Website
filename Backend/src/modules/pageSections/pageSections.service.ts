import { ApiError } from "../../utils/apiError";
import prisma from "../../DB/prisma";
import type { CreatePageSectionDTO, UpdatePageSectionDTO } from "./pageSections.validation";

export class pageSectionsService { 
    async createSection(pageId: number, data: CreatePageSectionDTO) {
        
        const page = await prisma.page.findUnique({
            where: { id: pageId }
        });

        if (!page) {
            throw new ApiError(404, 'Page not found');
        }

        const newSection = await prisma.pageSection.create({
            data: {
                title: data.title,
                position: data.position,
                page: { connect: { id: pageId } }
            }
        });

        return newSection;
    }

    async getSectionsByPageId(pageId: number) {
        const sections = await prisma.pageSection.findMany({
            where: { pageId: pageId },
            orderBy: { position: 'asc' }
        });
        return sections;
    }

    async deleteSection(sectionId: number) {
        const section = await prisma.pageSection.findUnique({
            where: { id: sectionId }
        });

        if (!section) {
            throw new ApiError(404, 'Section not found');
        }

        const deletedSection = await prisma.pageSection.delete({
            where: { id: sectionId }
        });

        return deletedSection;
    }

    async updateSection(sectionId: number, data: UpdatePageSectionDTO) {
        const section = await prisma.pageSection.findUnique({
            where: { id: sectionId }
        });

        if (!section) {
            throw new ApiError(404, 'Section not found');
        }

        const updatedSection = await prisma.pageSection.update({
            where: { id: sectionId },
            data,
        });

        return updatedSection;
    }

    async reorderSections(order: { id: number; position: number }[]) { 
        try {
			const updates = await prisma.$transaction(
				order.map((item) =>
					prisma.pageSection.update({
						where: { id: item.id },
						data: { position: item.position },
						select: { id: true, position: true },
					})
				)
			);

			return updates;
		} catch (error) {
			throw new ApiError(
				500,
				"Failed to reorder pages. One or more IDs may be invalid."
			);
		}
    }    
}