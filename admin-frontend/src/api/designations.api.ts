import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Designation } from "../types/Faculty.types";

export interface CreateDesignationDTO {
	title: string;
	priority: number;
	category: 'ADMINISTRATION' | 'DIRECTORATES' | 'PRINCIPALS' | 'EXAMINATION';
}

export interface UpdateDesignationDTO {
	title?: string;
	priority?: number;
	category?: 'ADMINISTRATION' | 'DIRECTORATES' | 'PRINCIPALS' | 'EXAMINATION';
}

export const getAllDesignations = async (): Promise<Designation[]> => {
	const res = await apiClient.get<ApiResponse<Designation[]>>(
		"/admin/designations",
	);
	return res.data.data;
};

export const createDesignation = async (
	payload: CreateDesignationDTO,
): Promise<Designation> => {
	const res = await apiClient.post<ApiResponse<Designation>>(
		"/admin/designations",
		payload,
	);
	return res.data.data;
};

export const updateDesignation = async (
	id: number,
	payload: UpdateDesignationDTO,
): Promise<Designation> => {
	const res = await apiClient.put<ApiResponse<Designation>>(
		`/admin/designations/${id}`,
		payload,
	);
	return res.data.data;
};

export const deleteDesignation = async (id: number): Promise<void> => {
	await apiClient.delete(`/admin/designations/${id}`);
};
