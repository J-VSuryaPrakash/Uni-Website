import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createDepartment,
	deleteDepartment,
	getAllDepartments,
	updateDepartment,
} from "@/api/departments.api";

export function useDepartments() {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: ["departments"] });

	const query = useQuery({
		queryKey: ["departments"],
		queryFn: getAllDepartments,
		staleTime: 5 * 60 * 1000,
	});

	const create = useMutation({
		mutationFn: createDepartment,
		onSuccess: invalidate,
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
			updateDepartment(id, data),
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: deleteDepartment,
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
