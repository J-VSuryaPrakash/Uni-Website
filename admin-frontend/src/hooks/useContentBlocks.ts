import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contentBlocksApi from "../api/contentBlocks.api";
import type {
	CreateBlockDTO,
	UpdateBlockDTO,
} from "../types/ContentBlocks.types";

export const useContentBlocks = (sectionId?: number | null) => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: ["content-blocks", sectionId],
		queryFn: () =>
			contentBlocksApi.getBlocksBySectionId(sectionId as number),
		enabled: !!sectionId,
	});

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: ["content-blocks", sectionId] });

	return {
		...query,
		create: useMutation({
			mutationFn: (data: CreateBlockDTO) =>
				contentBlocksApi.createBlock(sectionId as number, data),
			onSuccess: invalidate,
		}),
		update: useMutation({
			mutationFn: ({ id, data }: { id: number; data: UpdateBlockDTO }) =>
				contentBlocksApi.updateBlock(id, data),
			onSuccess: invalidate,
		}),
		remove: useMutation({
			mutationFn: contentBlocksApi.deleteBlock,
			onSuccess: invalidate,
		}),
		reorder: useMutation({
			mutationFn: contentBlocksApi.reorderBlocks,
			onSuccess: invalidate,
		}),
	};
};
