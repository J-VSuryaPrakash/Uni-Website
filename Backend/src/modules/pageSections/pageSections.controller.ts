import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { pageSectionsService } from "./pageSections.service";
import { createPageSectionSchema } from "./pageSections.validation";

const pageSectionService = new pageSectionsService();

export const createSection = asyncHandler(
	async (req: Request, res: Response) => {
		const pageId = Number(req.params.pageId);
		const data = createPageSectionSchema.parse(req.body);

		const newSection = await pageSectionService.createSection(pageId, data);

		res.status(201).json(
			new ApiResponse(201, newSection, "Section created successfully")
		);
	}
);

export const getSectionsByPageId = asyncHandler(
	async (req: Request, res: Response) => {
		const pageId = Number(req.params.pageId);

		const sections = await pageSectionService.getSectionsByPageId(pageId);

		res.status(200).json(
			new ApiResponse(200, sections, "Sections retrieved successfully")
		);
	}
);

export const deleteSection = asyncHandler(
    async (req: Request, res: Response) => {
        const sectionId = Number(req.params.sectionId);

        const deletedSection = await pageSectionService.deleteSection(sectionId);

        res.status(200).json(
            new ApiResponse(200, deletedSection, "Section deleted successfully")
        );
    }
);

export const updateSection = asyncHandler(
    async (req: Request, res: Response) => {
        const sectionId = Number(req.params.sectionId);

        const data = createPageSectionSchema.parse(req.body);
        
        const updatedSection = await pageSectionService.updateSection(sectionId, data);

        res.status(200).json(
            new ApiResponse(200, updatedSection, "Section updated successfully")
        );
    }
);

export const reorderSections = asyncHandler(
    async (req: Request, res: Response) => {
        const order = req.body as { id: number; position: number }[];

        const reorderedSections = await pageSectionService.reorderSections(order);

        res.status(200).json(
            new ApiResponse(200, reorderedSections, "Sections reordered successfully")
        );
    }
);