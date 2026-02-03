import api from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Page, CreatePageDTO, MovePageDTO } from "../types/Page.types";

export const getPages = async () => {
	const res = await api.get<ApiResponse<Page[]>>("/admin/pages");
	return res.data.data;
};

export const createPage = async (payload: CreatePageDTO) => {
	const res = await api.post<ApiResponse<Page>>("/admin/pages", payload);
	return res.data.data;
};

export const updatePage = async (
	id: number,
	payload: Partial<CreatePageDTO>,
) => {
	const res = await api.patch<ApiResponse<Page>>(
		`/admin/pages/${id}`,
		payload,
	);
	return res.data.data;
};

export const deletePage = async (id: number) => {
	await api.delete(`/admin/pages/${id}`);
};

export const movePage = async (id: number, payload: MovePageDTO) => {
	await api.patch(`/admin/pages/${id}/move`, payload);
};

export const reorderPages = async (payload: any[]) => {
	await api.patch(`/admin/pages/reorder/`, payload);
};
