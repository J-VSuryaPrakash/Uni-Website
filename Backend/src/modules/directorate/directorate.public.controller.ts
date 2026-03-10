import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { DirectorateService } from "./directorate.service";

const service = new DirectorateService();

export const getPublicDirectorates = asyncHandler(
    async (_req: Request, res: Response) => {
        const directorates = await service.getAllActiveDirectorates();
        res
            .status(200)
            .json(new ApiResponse(200, directorates, "Directorates fetched"));
    },
);

export const getDirectoratesByPage = asyncHandler(
    async (req: Request, res: Response) => {
        const pageId = Number(req.params.pageId);
        const directorates = await service.getDirectoratesByPageId(pageId);
        res
            .status(200)
            .json(new ApiResponse(200, directorates, "Directorates fetched"));
    },
);
