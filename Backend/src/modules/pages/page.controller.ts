import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import PageService from "./page.service";
import { CreatePageSchema, movePageSchema, UpdatePageSchema } from "./page.validation";

const pageService = new PageService();

export const createPage = asyncHandler(async (req: Request, res: Response) => {
    const data = await CreatePageSchema.parseAsync(req.body);
    
    const newPage = await pageService.Createpage(data);
    
	res.status(201).json(
		new ApiResponse(200, newPage, "Page created successfully")
	);
});

export const getAllpages = asyncHandler(async (req: Request, res: Response) => {

    const pages = await pageService.getAllpages();

    res.status(200).json(
        new ApiResponse(200, pages, "Pages retrieved successfully")
    );
});

export const getPageById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const page = await pageService.getPageById(id);

    res.status(200).json(
        new ApiResponse(200, page, "Page retrieved successfully")
    );
});

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await UpdatePageSchema.parseAsync(req.body);

    const updatedPage = await pageService.updatePage(id, data);

    res.status(200).json(
        new ApiResponse(200, updatedPage, "Page updated successfully")
    );
});

export const deletePage = asyncHandler(async (req: Request, res: Response) => { 
    const id = Number(req.params.id);
    const deletedPage =await pageService.deletePage(id);

    res.status(200).json(
        new ApiResponse(200, deletedPage, "Page deleted successfully")
    );
});

export const movePage = asyncHandler(async (req: Request, res: Response) => { 
    const id = Number(req.params.id);
    const data = await movePageSchema.parseAsync(req.body);

    const movedPage = await pageService.movePage(id, data);

    res.status(200).json(
        new ApiResponse(200, movedPage, "Page moved successfully")
    );

});

export const reorderPages = asyncHandler(async (req: Request, res: Response) => { 
    const order = req.body as { id: number; position: number }[];

    if (!Array.isArray(order) || order.some(item => typeof item.id !== 'number' || typeof item.position !== 'number')) {
        res.status(400).json(
            new ApiResponse(400, null, "Invalid order format")
        );
        return;
    }

    const reorderedPages = await pageService.reorderPages(order);

    res.status(200).json(
        new ApiResponse(200, reorderedPages, "Pages reordered successfully")
    );
});


/* ---------- PUBLIC ---------- */

export const getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug;

    if (!slug) {
        res.status(400).json(
            new ApiResponse(400, null, "Slug parameter is required")
        );
        return;
    }

    const page = await pageService.getPageBySlug(slug);

    res.status(200).json(
        new ApiResponse(200, page, "Page retrieved successfully")
    );
});