import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createDesignation,
	deleteDesignation,
	getAllDesignations,
	updateDesignation,
} from "@/api/designations.api";
import type { CreateDesignationDTO, UpdateDesignationDTO } from "@/api/designations.api";

export function useDesignations() {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: ["designations"] });

	const query = useQuery({
		queryKey: ["designations"],
		queryFn: getAllDesignations,
		staleTime: 5 * 60 * 1000,
	});

	const create = useMutation({
		mutationFn: (data: CreateDesignationDTO) => createDesignation(data),
		onSuccess: invalidate,
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateDesignationDTO }) =>
			updateDesignation(id, data),
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: deleteDesignation,
		onSuccess: invalidate,
	});

	return {
		data: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		create,
		update,
		remove,
	};
}
