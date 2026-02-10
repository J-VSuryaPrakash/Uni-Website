import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as sectionsApi from "../api/sections.api";
import type {
	CreateSectionDTO,
	UpdateSectionDTO,
} from "../types/PageSection.types";

export const usePageSections = (pageId?: number | null) => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: ["page-sections", pageId],
		queryFn: () => sectionsApi.getSectionsByPageId(pageId as number),
		enabled: !!pageId,
	});

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: ["page-sections", pageId] });

	return {
		...query,
		create: useMutation({
			mutationFn: (data: CreateSectionDTO) =>
				sectionsApi.createSection(pageId as number, data),
			onSuccess: invalidate,
		}),
		update: useMutation({
			mutationFn: ({
				id,
				data,
			}: {
				id: number;
				data: UpdateSectionDTO;
			}) => sectionsApi.updateSection(id, data),
			onSuccess: invalidate,
		}),
		remove: useMutation({
			mutationFn: sectionsApi.deleteSection,
			onSuccess: invalidate,
		}),
		reorder: useMutation({
			mutationFn: sectionsApi.reorderSections,
			onSuccess: invalidate,
		}),
	};
};
