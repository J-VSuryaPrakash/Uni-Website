import api from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { ContentBlock } from "../types/ContentBlocks.types";

export const createBlock = async (sectionId: number, blockType: string) => {
	const res = await api.post<ApiResponse<ContentBlock>>(
		`/admin/sections/${sectionId}/blocks`,
		{ blockType, position: 0, content: {} },
	);
	return res.data.data;
};

export const updateBlock = async (id: number, data: any) => {
	await api.patch(`/admin/blocks/${id}`, data);
};

export const deleteBlock = async (id: number) => {
	await api.delete(`/admin/blocks/${id}`);
};

export const reorderBlocks = async (payload: any[]) => {
	await api.patch(`/admin/blocks/reorder`, payload);
};
