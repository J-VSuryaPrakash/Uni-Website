import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Department } from "../types/Notification.types";

export interface CreateDepartmentDTO {
	name: string;
}

export interface UpdateDepartmentDTO {
	name?: string;
}

export const getAllDepartments = async (): Promise<Department[]> => {
	const res = await apiClient.get<ApiResponse<Department[]>>(
		"/admin/departments",
	);
	return res.data.data;
};

export const createDepartment = async (
	payload: CreateDepartmentDTO,
): Promise<Department> => {
	const res = await apiClient.post<ApiResponse<Department>>(
		"/admin/departments",
		payload,
	);
	return res.data.data;
};

export const updateDepartment = async (
	id: number,
	payload: UpdateDepartmentDTO,
): Promise<Department> => {
	const res = await apiClient.put<ApiResponse<Department>>(
		`/admin/departments/${id}`,
		payload,
	);
	return res.data.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
	await apiClient.delete(`/admin/departments/${id}`);
};
