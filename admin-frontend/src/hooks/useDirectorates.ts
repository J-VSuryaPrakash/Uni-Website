import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createDirectorate,
	deleteDirectorate,
	getAllDirectorates,
	updateDirectorate,
} from "@/api/directorates.api";
import { getAllDesignations } from "@/api/designations.api";
import { getAllDepartments } from "@/api/departments.api";
import type { CreateDirectorateDTO, UpdateDirectorateDTO } from "@/types/Directorate.types";

export function useDirectorates() {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: ["directorates"] });

	const query = useQuery({
		queryKey: ["directorates"],
		queryFn: getAllDirectorates,
		staleTime: 5 * 60 * 1000,
	});

	const designationsQuery = useQuery({
		queryKey: ["designations"],
		queryFn: getAllDesignations,
		staleTime: 5 * 60 * 1000,
	});

	const departmentsQuery = useQuery({
		queryKey: ["departments"],
		queryFn: getAllDepartments,
		staleTime: 5 * 60 * 1000,
	});

	const create = useMutation({
		mutationFn: (data: CreateDirectorateDTO) => createDirectorate(data),
		onSuccess: invalidate,
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateDirectorateDTO }) =>
			updateDirectorate(id, data),
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: deleteDirectorate,
		onSuccess: invalidate,
	});

	return {
		data: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		allDesignations: designationsQuery.data ?? [],
		allDepartments: departmentsQuery.data ?? [],
		create,
		update,
		remove,
	};
}
