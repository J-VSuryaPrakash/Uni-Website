import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { MediaService } from "./media.service";
import { createMediaSchema } from "./media.validation";
import { ApiResponse } from "../../utils/apiResponse";

const mediaService = new MediaService();

export const createMedia = asyncHandler(async(req: Request, res: Response) => {

    const data = createMediaSchema.parse(req.body);

    const media = await mediaService.createMedia(data);

    res.status(201).json(new ApiResponse(201,media,"Media created successfully"));
});

export const getMediaById = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);

    const media = await mediaService.getMediaById(id);

    res.status(200).json(new ApiResponse(200,media,"Media fetched successfully"));
});

export const deleteMediaById = asyncHandler(async(req: Request, res: Response) => {

    const id = Number(req.params.id);

    const media = await mediaService.deleteMediaById(id);

    res.status(200).json(new ApiResponse(200,media,"Media deleted successfully"));

});