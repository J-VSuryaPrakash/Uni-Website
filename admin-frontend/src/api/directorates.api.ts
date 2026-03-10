import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Directorate, CreateDirectorateDTO, UpdateDirectorateDTO } from "../types/Directorate.types";

export const getAllDirectorates = async (): Promise<Directorate[]> => {
	const res = await apiClient.get<ApiResponse<Directorate[]>>(
		"/admin/directorates",
	);
	return res.data.data;
};

export const getDirectorateById = async (id: number): Promise<Directorate> => {
	const res = await apiClient.get<ApiResponse<Directorate>>(
		`/admin/directorates/${id}`,
	);
	return res.data.data;
};

export const createDirectorate = async (
	payload: CreateDirectorateDTO,
): Promise<Directorate> => {
	const res = await apiClient.post<ApiResponse<Directorate>>(
		"/admin/directorates",
		payload,
	);
	return res.data.data;
};

export const updateDirectorate = async (
	id: number,
	payload: UpdateDirectorateDTO,
): Promise<Directorate> => {
	const res = await apiClient.patch<ApiResponse<Directorate>>(
		`/admin/directorates/${id}`,
		payload,
	);
	return res.data.data;
};

export const deleteDirectorate = async (id: number): Promise<void> => {
	await apiClient.delete(`/admin/directorates/${id}`);
};
