import api from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { PageSection } from "../types/PageSection.types";

export const createSection = async (pageId: number) => {
	const res = await api.post<ApiResponse<PageSection>>(
		`/admin/pages/${pageId}/sections`,
		{ position: 0 },
	);
	return res.data.data;
};

export const updateSection = async (id: number, data: any) => {
	await api.patch(`/admin/sections/${id}`, data);
};

export const deleteSection = async (id: number) => {
	await api.delete(`/admin/sections/${id}`);
};

export const reorderSections = async (payload: any[]) => {
	await api.patch(`/admin/sections/reorder/`, payload);
};
