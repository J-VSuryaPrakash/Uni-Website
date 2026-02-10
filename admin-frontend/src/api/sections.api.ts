import type { ApiResponse } from "../types/ApiResponce.types";
import type { CreateSectionDTO, PageSection } from "../types/PageSection.types";
import api from "./axios";

export const getSectionsByPageId = async (pageId: number) => {
	const res = await api.get<ApiResponse<PageSection[]>>(
		`/admin/pages/${pageId}/sections`,
	);
	return res.data.data;
};

export const createSection = async (
	pageId: number,
	data?: CreateSectionDTO,
) => {
	const res = await api.post<ApiResponse<PageSection>>(
		`/admin/pages/${pageId}/sections`,
		{
			position: data?.position ?? 0,
			...(data?.title ? { title: data.title } : {}),
		},
	);
	return res.data.data;
};

export const updateSection = async (id: number, data: any) => {
	const res = await api.patch<ApiResponse<PageSection>>(
		`/admin/sections/${id}`,
		data,
	);
	return res.data.data;
};

export const deleteSection = async (id: number) => {
	await api.delete(`/admin/sections/${id}`);
};

export const reorderSections = async (payload: any[]) => {
	await api.patch(`/admin/sections/reorder/`, payload);
};
