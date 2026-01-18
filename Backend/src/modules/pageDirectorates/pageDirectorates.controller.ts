import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { PageDirectoratesService } from "./pageDirectorates.service";
import { createPageDirectorate } from "./pageDirectorates.validation";

const pageDirectoratesService = new PageDirectoratesService();

export const createPageDirectorates = asyncHandler(async (req: Request, res: Response) => {

    const data = createPageDirectorate.parse(req.body);

    const pageDirectorate = await pageDirectoratesService.createPageDirectorate(data);

    res.status(201).json(new ApiResponse(201, pageDirectorate, "Page Directorate created successfully"));

});

export const getPageDirectorates = asyncHandler(async (req: Request, res: Response) => {

    const pageDirectorates = await pageDirectoratesService.getPageDirectorates();

    res.status(200).json(new ApiResponse(200, pageDirectorates, "Page Directorates fetched successfully"));

});

export const getPageDirectoratesForPage = asyncHandler(async (req: Request, res: Response) => {

    const { pageId } = req.params;

    if (isNaN(Number(pageId))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Page ID"));
    }

    const pageDirectorates = await pageDirectoratesService.getPageDirectoratesForPage(Number(pageId));

    res.status(200).json(new ApiResponse(200, pageDirectorates, "Page Directorates for Page fetched successfully"));

});

export const getPageDirectorateById = asyncHandler(async (req: Request, res: Response) => {

    const { pageId, directorateId } = req.params;

    if (isNaN(Number(pageId)) || isNaN(Number(directorateId))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Page ID or Directorate ID"));
    }

    const pageDirectorate = await pageDirectoratesService.getPageDirectorateById(Number(pageId), Number(directorateId));

    res.status(200).json(new ApiResponse(200, pageDirectorate, "Page Directorate fetched successfully"));

});

export const updatePageDirectoratePosition = asyncHandler(async (req: Request, res: Response) => {

    const { pageId, directorateId } = req.params;

    if (isNaN(Number(pageId)) || isNaN(Number(directorateId))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Page ID or Directorate ID"));
    }

    const { position } = req.body;

    if (isNaN(Number(position))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid position value"));
    }

    const pageDirectorate = await pageDirectoratesService.updatePageDirectoratePosition(Number(pageId), Number(directorateId), Number(position));

    res.status(200).json(new ApiResponse(200, pageDirectorate, "Page Directorate position updated successfully"));
});

export const deletePageDirectorate = asyncHandler(async (req: Request, res: Response) => {

    const { pageId, directorateId } = req.params;

    if (isNaN(Number(pageId)) || isNaN(Number(directorateId))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Page ID or Directorate ID"));
    }

    await pageDirectoratesService.deletePageDirectorate(Number(pageId), Number(directorateId));

    res.status(200).json(new ApiResponse(200, null, "Page Directorate deleted successfully"));
});



