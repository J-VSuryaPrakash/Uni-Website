import type { Request, Response } from "express";
import { EventCategoryService } from "./eventCategory.service";
import { createEventCategorySchema, updateEventCategorySchema, } from "./eventCategory.validation";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";

const eventCategoryService = new EventCategoryService();

export const createEventCategory = asyncHandler(async (req: Request, res: Response) => {

    const data = createEventCategorySchema.parse(req.body);

    const category = await eventCategoryService.createCategory(data);

    res.status(201).json(new ApiResponse(201, category, 'Event Category created successfully'));
})

export const getAllEventCategories = asyncHandler(async (req: Request, res: Response) => {

    const categories = await eventCategoryService.getAllCategories();

    res.status(200).json(new ApiResponse(200, categories, 'Event Categories fetched successfully'));
});

export const updateEventCategory = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const data = updateEventCategorySchema.parse(req.body);

    const category = await eventCategoryService.updateCategory(id, data);

    res.status(200).json(new ApiResponse(200, category, 'Event Category updated successfully'));
})

export const toggleEventCategory = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const category = await eventCategoryService.toggleCategoryStatus(id);

    res.status(200).json(new ApiResponse(200, category, 'Event Category updated successfully'));
})

export const getActiveEventCategories = asyncHandler(async (req: Request, res: Response) => {

    const categories = await eventCategoryService.getActiveCategories();
   
    res.status(200).json(new ApiResponse(200, categories, 'Active Event Categories fetched successfully'));
});