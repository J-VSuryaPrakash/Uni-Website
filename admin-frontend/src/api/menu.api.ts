import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Menu, CreateMenuDTO, UpdateMenuDTO } from "../types/Menu.types";

export const getMenus = async () => {
	const res = await apiClient.get<ApiResponse<Menu[]>>("/admin/menus");
	return res.data.data;
};

export const createMenu = async (payload: CreateMenuDTO) => {
	const res = await apiClient.post<ApiResponse<Menu>>("/admin/menus", payload);
	return res.data.data;
};

export const updateMenu = async (id: number, payload: UpdateMenuDTO) => {
	const res = await apiClient.patch<ApiResponse<Menu>>(
		`/admin/menus/${id}`,
		payload,
	);
	return res.data.data;
};

export const deleteMenu = async (id: number) => {
	await apiClient.delete(`/admin/menus/${id}`);
};

export const reorderMenus = async (
	payload: { id: number; position: number }[],
) => {
	await apiClient.patch("/admin/menus/reorder", payload);
};
