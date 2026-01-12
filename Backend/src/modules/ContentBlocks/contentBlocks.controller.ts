import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ContentBlocksService } from "./contentBlocks.service";
import { createContentBlockSchema } from "./contentBlocks.validation";

const contentBlocksService = new ContentBlocksService();

export const createContentBlock = asyncHandler(
	async (req: Request, res: Response) => {
		const sectionId = Number(req.params.sectionId);
		const data = createContentBlockSchema.parse(req.body);

		const contentBlock = await contentBlocksService.createContentBlock(
			sectionId,
			data
		);

		res.status(200).json(
			new ApiResponse(
				200,
				contentBlock,
				"Content block created successfully"
			)
		);
	}
);

export const getBlocksBySectionId = asyncHandler(
    async (req: Request, res: Response) => {
        const sectionId = Number(req.params.sectionId);
        const contentBlocks = await contentBlocksService.getBlockBySectionId(sectionId);

        res.status(200).json(
            new ApiResponse(
                200,
                contentBlocks,
                "Content blocks retrieved successfully"
            )
        );
    }
);

export const updateContentBlock = asyncHandler(
    async (req: Request, res: Response) => {
        const blockId = Number(req.params.blockId);
        const data = req.body;

        const updatedBlock = await contentBlocksService.updateContentBlock(blockId, data);

        res.status(200).json(
            new ApiResponse(
                200,
                updatedBlock,
                "Content block updated successfully"
            )
        );
    }
);

export const deleteContentBlock = asyncHandler(
    async (req: Request, res: Response) => {
        const blockId = Number(req.params.blockId);
        const deletedBlock = await contentBlocksService.deleteContentBlock(blockId);
        res.status(200).json(
            new ApiResponse(
                200,
                deletedBlock,
                "Content block deleted successfully"
            )
        );
    }
);

export const reorderContentBlocks = asyncHandler(
    async (req: Request, res: Response) => {
        const order: { id: number; position: number }[] = req.body;
        const reorderedBlocks = await contentBlocksService.reorderContentBlocks(order);
        res.status(200).json(   
            new ApiResponse(
                200,
                reorderedBlocks,
                "Content blocks reordered successfully"
            )
        );
    }
);