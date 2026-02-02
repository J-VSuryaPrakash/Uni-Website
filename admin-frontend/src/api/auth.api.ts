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
		"/admin/auth/login",
		data,
	);

	return res.data.data;
};

export const logout = async () => {
	const res = await apiClient.get("/admin/auth/logout");

	return res.data.message;
};

export const registerAdmin = async (data: registerPayload) => {
    const res = await apiClient.post<ApiResponse<AdminUser>>(
        "/admin/auth/register",
        data
    );

    return res.data.data;
};

export const getMe = async () => {
	try {
		const res =
			await apiClient.get<ApiResponse<AdminUser>>("/admin/auth/me");
		return res.data.data;
	} catch (error: any) {
		// If the error is 401, it just means no one is logged in.
		// Return null instead of throwing an error.
		if (error.response?.status === 401) {
			return null;
		}
		throw error; // Re-throw other errors (500, network issues, etc.)
	}
};
