import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type { Media } from "../types/Notification.types";

export type UploadFolder = "notifications" | "faculty" | "events" | "general";

export interface UploadedMedia extends Media {
	originalName: string;
	size: number;
	mimetype: string;
}

/**
 * Upload a file to the backend.
 * Returns a Media record with the public URL.
 *
 * Usage:
 *   const media = await uploadFile(file, "notifications");
 *   // media.url  →  "/uploads/notifications/1234567-abc.pdf"
 *   // media.type →  "pdf"
 */
export const uploadFile = async (
	file: File,
	folder: UploadFolder = "general",
	onProgress?: (percent: number) => void,
): Promise<UploadedMedia> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("folder", folder);

	const res = await apiClient.post<ApiResponse<UploadedMedia>>(
		"/admin/upload",
		formData,
		{
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: (evt) => {
				if (onProgress && evt.total) {
					onProgress(Math.round((evt.loaded * 100) / evt.total));
				}
			},
		},
	);

	return res.data.data;
};

/**
 * Delete an uploaded media file from the server.
 * Removes both the DB record and the file from disk.
 */
export const deleteUploadedMedia = async (mediaId: number): Promise<void> => {
	await apiClient.delete(`/admin/upload/${mediaId}`);
};
