import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { EventMediaService } from "./eventMedia.service";
import { createEventMediaSchema } from "./eventMedia.validation";
import { ApiResponse } from "../../utils/apiResponse";

const eventMediaService = new EventMediaService();

export const createEventMedia = asyncHandler(async (req: Request, res: Response) => {

    const data = createEventMediaSchema.parse(req.body);

    const eventMedia = await eventMediaService.createEventMedia(data);

    res.status(201).json(new ApiResponse(201, eventMedia, "Event media created successfully"));

});

export const getEventMedia = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const eventMedia = await eventMediaService.getEventMediaById(id);

    res.status(200).json(new ApiResponse(200, eventMedia, "Event media retrieved successfully"));
});