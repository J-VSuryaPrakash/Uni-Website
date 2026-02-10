import type { ApiResponse } from "../types/ApiResponce.types";
import type {
	BlockType,
	ContentBlock,
	CreateBlockDTO,
} from "../types/ContentBlocks.types";
import api from "./axios";

export const getBlocksBySectionId = async (sectionId: number) => {
	const res = await api.get<ApiResponse<ContentBlock[]>>(
		`/admin/sections/${sectionId}/blocks`,
	);
	return res.data.data;
};

export const createBlock = async (
	sectionId: number,
	blockTypeOrData?: BlockType | CreateBlockDTO,
	data?: CreateBlockDTO,
) => {
	const payload: CreateBlockDTO =
		typeof blockTypeOrData === "string"
			? {
					blockType: blockTypeOrData,
					position: data?.position ?? 0,
					content: data?.content ?? {},
					...(data?.isVisible !== undefined
						? { isVisible: data.isVisible }
						: {}),
				}
			: {
					blockType: blockTypeOrData?.blockType ?? "text",
					position: blockTypeOrData?.position ?? 0,
					content: blockTypeOrData?.content ?? {},
					...(blockTypeOrData?.isVisible !== undefined
						? { isVisible: blockTypeOrData.isVisible }
						: {}),
				};
	const res = await api.post<ApiResponse<ContentBlock>>(
		`/admin/sections/${sectionId}/blocks`,
		payload,
	);
	return res.data.data;
};

export const updateBlock = async (id: number, data: any) => {
	const res = await api.patch<ApiResponse<ContentBlock>>(
		`/admin/blocks/${id}`,
		data,
	);
	return res.data.data;
};

export const deleteBlock = async (id: number) => {
	await api.delete(`/admin/blocks/${id}`);
};

export const reorderBlocks = async (payload: any[]) => {
	await api.patch(`/admin/blocks/reorder`, payload);
};
