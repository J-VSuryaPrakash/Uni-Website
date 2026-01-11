import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import MenuService from "./menu.service";
import { CreateMenuSchema, UpdateMenuSchema } from "./menu.validation";

const menuService = new MenuService();

export const createMenu = asyncHandler(async (req: Request, res: Response) => {
	const data = CreateMenuSchema.parse(req.body);

	const newMenu = await menuService.CreateMenu(data);

	res.status(201).json(
		new ApiResponse(201, newMenu, "Menu created successfully")
	);
});

export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = UpdateMenuSchema.parse(req.body);

    const updatedMenu = await menuService.UpdateMenu(id, data);

    res.status(200).json(
        new ApiResponse(200, updatedMenu, "Menu updated successfully")
    );
})

export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deletedMenu = await menuService.DeleteMenu(id);

    res.status(200).json(
        new ApiResponse(200, deletedMenu, "Menu deleted successfully")
    );
})

export const getAllMenus = asyncHandler(async (req: Request, res: Response) => {
    const menus = await menuService.getAllMenus();

    res.status(200).json(
        new ApiResponse(200, menus, "All Menus retrieved successfully")
    );
})

export const getMenuById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const menu = await menuService.getMenuById(id);

    res.status(200).json(
        new ApiResponse(200, menu, "Menu retrieved successfully")
    );
})

export const reorderMenus = asyncHandler(async (req: Request, res: Response) => {
	const order = req.body as { id: number; position: number }[];

    const reOrderedMenus = await menuService.reorderMenus(order);
    
    const reorderedMenusData = reOrderedMenus.map(menu => ({
        id: menu.id,
        position: menu.position
    }));

	res.status(200).json(
		new ApiResponse(200, reorderedMenusData, "Menus reordered successfully")
	);
});

export const getPublicMenus = asyncHandler(async (req: Request, res: Response) => { 
    const publicMenus = await menuService.getPublicMenus();

    res.status(200).json(
        new ApiResponse(200, publicMenus, "Public menus retrieved successfully")
    );
});