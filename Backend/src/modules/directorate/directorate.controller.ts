import type { Request, Response } from "express"; 
import { asyncHandler } from "../../utils/asyncHandler";
import { DirectorateService } from "./directorate.service";
import { createDirectorateSchema, updateDirectorateSchema } from "./directorate.validation";

const directorateService = new DirectorateService();

export const createDirectorate = asyncHandler(async (req: Request, res: Response) => {

    const data = createDirectorateSchema.parse(req.body);

    const directorate = await directorateService.createDirectorate(data);

    res.status(201).json({
        message: "Directorate created successfully",
        data: directorate
    });
})

export const getAllDirectorates = asyncHandler(async (req: Request, res: Response) => {

    const directorates = await directorateService.getAllDirectorates();

    res.status(200).json({
        message: "Directorates fetched successfully",
        data: directorates
    });
});

export const getDirectorateById = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const directorate = await directorateService.getDirectorateById(id);

    res.status(200).json({
        message: "Directorate fetched successfully",
        data: directorate
    });

})

export const updateDirectorate = asyncHandler(async (req: Request, res: Response) => {

    const id = Number(req.params.id);

    const data = updateDirectorateSchema.parse(req.body);

    const directorate = await directorateService.updateDirectorate(id, data);

    res.status(200).json({  
        message: "Directorate updated successfully",
        data: directorate
    });
});

export const deleteDirectorate = asyncHandler(async (req: Request, res: Response) => {
    
    const id = Number(req.params.id);

    const deleteDirectorate = await directorateService.deleteDirectorate(id);

    res.status(200).json({
        data: deleteDirectorate,
        message: "Directorate deleted successfully"
    });
}); 