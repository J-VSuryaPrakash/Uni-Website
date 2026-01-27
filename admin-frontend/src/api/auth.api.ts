import type { ApiResponse } from "../types/ApiResponce.types";
import apiClient from "./axios";

export interface loginPayload {
	email: string;
	password: string;
}

export interface registerPayload {
	name: string;
	email: string;
	password: string;
}

export interface AdminUser {
	id: number;
	name: string;
	email: string;
}

export const login = async (data: loginPayload) => {
	const res = await apiClient.post<ApiResponse<AdminUser>>(
		"/admin/adminLogin",
		data,
	);

	return res.data.data;
};

export const logout = async () => {
	const res = await apiClient.post("/admin/adminLogout");

	return res.data.message;
};

export const registerAdmin = async (data: registerPayload) => {
    const res = await apiClient.post<ApiResponse<AdminUser>>(
        "/admin/adminRegister",
        data
    );

    return res.data.data;
};

export const getMe = async () => {
	const res = await apiClient.get<ApiResponse<AdminUser>>("/admin/auth/me");
	return res.data.data;
};
