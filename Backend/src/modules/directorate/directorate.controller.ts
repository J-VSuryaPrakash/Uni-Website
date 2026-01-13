import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { DirectorateService } from "./directorate.service";
import {
    createDirectorateSchema,
    updateDirectorateSchema,
} from "./directorate.validation";
import { ApiResponse } from "../../utils/apiResponse";

const directorateService = new DirectorateService();

export const createDirectorate = asyncHandler(
    async (req: Request, res: Response) => {
        const data = createDirectorateSchema.parse(req.body);

        const directorate = await directorateService.createDirectorate(data);

        res
            .status(201)
            .json(
                new ApiResponse(201, directorate, "Directorate created successfully")
            );
    }
);

export const getAllDirectorates = asyncHandler(
    async (req: Request, res: Response) => {
        const directorates = await directorateService.getAllDirectorates();

        res
            .status(200)
            .json(
                new ApiResponse(200, directorates, "Directorates fetched successfully")
            );
    }
);

export const getDirectorateById = asyncHandler(
    async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const directorate = await directorateService.getDirectorateById(id);

        res
            .status(200)
            .json(
                new ApiResponse(200, directorate, "Directorate fetched successfully")
            );
    }
);

export const updateDirectorate = asyncHandler(
    async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const data = updateDirectorateSchema.parse(req.body);

        const directorate = await directorateService.updateDirectorate(id, data);

        res
            .status(200)
            .json(
                new ApiResponse(200, directorate, "Directorate updated successfully")
            );
    }
);

export const deleteDirectorate = asyncHandler(
    async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const deleteDirectorate = await directorateService.deleteDirectorate(id);

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    deleteDirectorate,
                    "Directorate deleted successfully"
                )
            );
    }
);
