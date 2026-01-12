import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import DesignationService from "./designation.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { CreateDesignationSchema, UpdateDesignationSchema } from "./designation.validation";
import { ApiError } from "../../utils/apiError";


const designationService = new DesignationService();

export const createDesignation = asyncHandler(async (req: Request, res: Response) => {

    const data = CreateDesignationSchema.parse(req.body);

    const newDesignation = await designationService.createDesignation(data);

    res.status(201).json(
        new ApiResponse(201, newDesignation, "Designation created successfully")
    );
})

export const updateDesignation = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const data = UpdateDesignationSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
        throw new ApiError(400, "At least one field must be provided");
    }

    const updatedDesignation = await designationService.updateDesignation(id, data);

    res.status(200).json(
        new ApiResponse(200, updatedDesignation, "Designation updated successfully")
    );
})

export const getAllDesignations = asyncHandler(async (req: Request, res: Response) => {

    const designations = await designationService.getAllDesignations();



    res.status(200).json(
        new ApiResponse(200, designations, "Designations retrieved successfully")
    );
});

export const deleteDesignation = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    await designationService.deleteDesignation(id);

    res.status(200).json(
        new ApiResponse(200, null, "Designation deleted successfully")
    );
});